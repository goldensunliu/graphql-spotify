import {
    getFeaturedPlaylists, getRecentlyPlayed, makePlaylistLoader, makePlaylistTracksLoader, makeAlbumsLoader,
    makeUserLoader, makeArtistsLoader, makeAudioFeaturesLoader, saveTrackToLib, makeTracksLoader, makeSavedContainsLoader
} from './SpotifyWebApi'

export function makeResolvers(token) {
    const PlaylistLoader = makePlaylistLoader(token)
    const PlaylistTracksLoader = makePlaylistTracksLoader(token)
    const AlbumLoader = makeAlbumsLoader(token)
    const UserLoader = makeUserLoader(token)
    const ArtistLoader = makeArtistsLoader(token)
    const AudioFeatureLoader = makeAudioFeaturesLoader(token)
    const SavedContainsLoader = makeSavedContainsLoader(token)
    const TrackLoader = makeTracksLoader(token)

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
                return await ArtistLoader.load(artistId)
            },
            track: async(obj, {id}) => {
                return await TrackLoader.load(id)
            },
            audioFeatures: async (obj, {id}) => {
                return await AudioFeatureLoader.load(id)
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
                const artistFull = await ArtistLoader.load(id)
                return artistFull.followers.total
            },
            images: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.images
            },
            popularity: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.popularity
            },
            genres: async ({ id }) => {
                const artistFull = await ArtistLoader.load(id)
                return artistFull.genres
            },

        },
        Album: {
            genres: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.genres
            },
            label: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.label
            },
            popularity: async (object) => {
                const AlbumFull = await AlbumLoader.load(object.id)
                return AlbumFull.popularity
            },
            release_date: async (object) => {
                const { release_date } = await AlbumLoader.load(object.id)
                return release_date
            },
            release_date_precision: async (object) => {
                const { release_date_precision } = await AlbumLoader.load(object.id)
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