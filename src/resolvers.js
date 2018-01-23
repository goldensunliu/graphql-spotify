import {
    getFeaturedPlaylists, getRecentlyPlayed, makeLoaders, saveTrackToLib
} from './SpotifyWebApi'

export function makeResolvers(token) {
    const {
        PlaylistLoader, PlaylistTracksLoader, AlbumsLoader, UserLoader, ArtistsLoader,
        AudioFeaturesLoader, SavedContainsLoader, TracksLoader
    } = makeLoaders(token);

    const resolvers = {
        RootQuery: {
            featuredPlaylists: async (obj, args) => {
                const res = await getFeaturedPlaylists(token, args)
                return res.playlists
            },
            recentlyPlayed: async () => {
                const { items } = await getRecentlyPlayed(token)
                return items
            },
            playlist: async(obj, {playlistId, userId}) => {
                return await PlaylistLoader.load({ playlistId, userId })
            },
            artist: async(obj, {artistId}) => {
                return await ArtistsLoader.load(artistId)
            },
            track: async(obj, {id}) => {
                return await TracksLoader.load(id)
            },
            audioFeatures: async (obj, {id}) => {
                return await AudioFeaturesLoader.load(id)
            }
        },
        Mutation: {
            saveTrack: async (obj, {trackId}) => {
                await saveTrackToLib(token, [trackId])
                return { id: trackId, saved: true }
            }
        },
        Playlist: {
            description: async (object) => {
                const {id: playlistId , owner: { id: userId }} = object
                const playlistFull = await PlaylistLoader.load({ playlistId, userId })
                return playlistFull.description
            },
            totalTracks: async ({ tracks: { total }}) => {
                return total
            },
            tracks: async (obj, args) => {
                const { id: playlistId , owner: { id: userId }, tracks: { total, offset, items, limit }} = obj
                // fetch with limit and offset when specified
                if (args.limit && args.offset) {
                    return await PlaylistTracksLoader.load({playlistId, userId, ...args })
                }
                // otherwise always fetch all of the tracks
                let currentOffset = items.length;
                let fetches = []
                while (currentOffset < total ) {
                    fetches.push(PlaylistTracksLoader.load({playlistId, userId, limit, offset: currentOffset }))
                    currentOffset = currentOffset + limit;
                }
                const fetchResults = await Promise.all(fetches);
                let allItems = items
                fetchResults.forEach((result) => {
                    allItems = allItems.concat(result.items)
                })
                return { total, items: allItems, limit: total, offset }
            }
        },
        Track: {
            audio_features: async ({ id }) => {
                return await AudioFeatureLoader.load(id)
            },
            saved: async ({id}) => {
                return await SavedContainsLoader.load(id)
            }
        },
        User: {
            followerCount: async ({ id }) => {
                const userFull = await UserLoader.load(id)
                return userFull.followers.total
            }
        },
        Artist: {
            followerCount: async ({ id }) => {
                const artistFull = await ArtistsLoader.load(id)
                return artistFull.followers.total
            },
            images: async ({ id }) => {
                const artistFull = await ArtistsLoader.load(id)
                return artistFull.images
            },
            popularity: async ({ id }) => {
                const artistFull = await ArtistsLoader.load(id)
                return artistFull.popularity
            },
            genres: async ({ id }) => {
                const artistFull = await ArtistsLoader.load(id)
                return artistFull.genres
            },

        },
        Album: {
            genres: async (object) => {
                const AlbumFull = await AlbumsLoader.load(object.id)
                return AlbumFull.genres
            },
            label: async (object) => {
                const AlbumFull = await AlbumsLoader.load(object.id)
                return AlbumFull.label
            },
            popularity: async (object) => {
                const AlbumFull = await AlbumsLoader.load(object.id)
                return AlbumFull.popularity
            },
            release_date: async (object) => {
                const { release_date } = await AlbumsLoader.load(object.id)
                return release_date
            },
            release_date_precision: async (object) => {
                const { release_date_precision } = await AlbumsLoader.load(object.id)
                return release_date_precision
            }
        },
        Item: {
            __resolveType(object, context, info){
                const { type } = object
                if (type === 'user') {
                    return 'User'
                }
                if (type === 'playlist') {
                    return 'Playlist'
                }
                if (object.added_at) {
                    return 'PlaylistTrack'
                }
            }
        }
    };
    return resolvers
}