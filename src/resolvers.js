import {
    getFeaturedPlaylists, getRecentlyPlayed, makeLoaders, saveTracksToLib, followPlaylist, removeTracksFromLib
} from './SpotifyWebApi'

const MAX_PLAYLIST_TRACKS_FETCH_LIMIT = 100
const MAX_TOP_TYPE_FETCH_LIMIT = 50
const MAX_PLAYLIST_FOLLOWERS_CONTAINS_LIMIT = 5;

const makePlaylistResolver = ({ PlaylistLoader, PlaylistTracksLoader, PlaylistFollowersContainsLoader, MeLoader }) => {
    return {
        description: async (object) => {
            const {id: playlistId , owner: { id: userId }} = object
            const playlistFull = await PlaylistLoader.load({ playlistId, userId })
            return playlistFull.description
        },
        totalTracks: async ({ tracks: { total }}) => {
            return total
        },
        tracks: async (obj, args) => {
            const { id: playlistId , owner: { id: userId }, tracks: { total, offset, items }} = obj
            // fetch with limit and offset when specified
            if (args.limit && args.offset) {
                return await PlaylistTracksLoader.load({playlistId, userId, ...args })
            }
            // otherwise always fetch all of the tracks
            // when resolving a full playlist, tracks are set the first 100 tracks
            let allItems = items || []
            let currentOffset = allItems.length
            let fetches = []
            while (currentOffset < total ) {
                const fetchSize = Math.min(MAX_PLAYLIST_TRACKS_FETCH_LIMIT, total - currentOffset);
                fetches.push(PlaylistTracksLoader.load({playlistId, userId, limit: fetchSize, offset: currentOffset }))
                currentOffset = currentOffset + fetchSize;
            }
            const fetchResults = await Promise.all(fetches);
            fetchResults.forEach((result) => {
                allItems = allItems.concat(result.items)
            })
            return { total, items: allItems, limit: total, offset }
        },
        followersContains: async (obj, { userIds }) => {
            const { id: playlistId , owner: { id: playlistUserId } } = obj
            let currentOffset = 0
            let fetches = []
            let total = userIds.length
            while (currentOffset < total ) {
                const fetchSize = Math.min(MAX_PLAYLIST_FOLLOWERS_CONTAINS_LIMIT, total - currentOffset);
                fetches.push(PlaylistFollowersContainsLoader.load({ playlistUserId, playlistId,
                    userIds: userIds.slice(currentOffset, currentOffset + fetchSize)
                }))
                currentOffset = currentOffset + fetchSize;
            }
            const fetchResults = await Promise.all(fetches);
            return fetchResults.reduce((accu, value) => { return accu.concat(value) }, [])
        },
        following: async (obj) => {
            const { id: playlistId , owner: { id: playlistUserId } } = obj
            const me = await MeLoader.load()
            const userIds = [me.id]
            const [following] = await PlaylistFollowersContainsLoader.load({ playlistUserId, playlistId, userIds })
            return following
        },
    }
}

export function makeResolvers(token) {
    const {
        PlaylistLoader, PlaylistTracksLoader, AlbumsLoader, UserLoader, ArtistsLoader,
        AudioFeaturesLoader, SavedContainsLoader, TracksLoader, CategoriesLoader, RecommendationsLoader,
        CategoryPlaylistLoader, CategoryLoader, TopTypeLoader, PlaylistFollowersContainsLoader, MeLoader
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
            },
            categories: async (obj, args) => {
                const res = await CategoriesLoader.load(args)
                return res.categories
            },
            category: async (obj, args) => {
                const res = await CategoryLoader.load(args.id)
                return res
            },
            recommendations: async (obj, args) => {
                return await RecommendationsLoader.load(args.parameters)
            },
            top: async (obj, args) => {
                const { type, limit, offset, time_range } = args
                const result = await TopTypeLoader.load({ type, limit, offset, time_range })
                if (result.items.length >= limit) {
                    return result
                }
                let allItems = result.items
                const totalFetchSize = Math.min(limit, result.total)
                let currentOffset = allItems.length
                let fetches = []
                while (currentOffset < totalFetchSize) {
                    const fetchSize = Math.min(MAX_TOP_TYPE_FETCH_LIMIT, totalFetchSize - currentOffset);
                    fetches.push(TopTypeLoader.load({type, time_range, limit: fetchSize, offset: currentOffset }))
                    currentOffset = currentOffset + fetchSize;
                }
                const fetchResults = await Promise.all(fetches);
                fetchResults.forEach((result) => {
                    allItems = allItems.concat(result.items)
                })
                return { total: result.total, items: allItems, limit: allItems.length, offset }
            }
        },
        Mutation: {
            saveTrack: async (obj, {trackId}) => {
                const res = await saveTracksToLib(token, [trackId])
                if (res.status !== 200) return;
                return { id: trackId, saved: true }
            },
            saveTracks: async (obj, {trackIds}) => {
                const res = await saveTracksToLib(token, trackIds)
                if (res.status !== 200) return;
                return trackIds.map(id => ({ id, saved: true }))
            },
            removeTracks: async (obj, {trackIds}) => {
                const res = await removeTracksFromLib(token, trackIds)
                if (res.status !== 200) return;
                return trackIds.map(id => ({ id, saved: false }))
            }
        },
        Playlist: makePlaylistResolver({ PlaylistLoader, PlaylistTracksLoader, PlaylistFollowersContainsLoader, MeLoader }),
        Track: {
            audio_features: async ({ id }) => {
                return await AudioFeaturesLoader.load(id)
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
        Category: {
            playlists: async(category, args) => {
                const { playlists } = await CategoryPlaylistLoader.load({ id: category.id, queryParams: args })
                return playlists
            }
        },
        Item: {
            __resolveType(object, context, info){
                const { type } = object
                if (type === 'user') {
                    return 'User'
                }
                if (type === 'artist') {
                    return 'Artist'
                }
                if (type === 'track') {
                    return 'Track'
                }
                if (type === 'playlist') {
                    return 'Playlist'
                }
                if (object.added_at) {
                    return 'PlaylistTrack'
                }
                return 'Category'
            }
        }
    };
    return resolvers
}