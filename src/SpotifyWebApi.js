import 'isomorphic-fetch'
import Dataloader from 'dataloader'

function makeHeaders(token) {
    return {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': "application/json"
    }
}

function cacheKeyFnForQueryKeys(key) {
    return JSON.stringify(key)
}

function serializeToURLParameters(obj) {
    return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
}


export async function saveTrackToLib(token, trackIds) {
    const url = `https://api.spotify.com/v1/me/tracks?ids=${trackIds.toString()}`
    return await fetch(url, {
        method: 'PUT',
        headers: makeHeaders(token)
    })
}

export async function getSavedContains(token, trackIds) {
    const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.toString()}`
    let res = await fetch(url, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json()
    return res
}

export async function getFeaturedPlaylists(token, queryParams = {})
{
    let res = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?${serializeToURLParameters(queryParams)}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getCategoryPlaylists(token, id, queryParams = {})
{
    let res = await fetch(`https://api.spotify.com/v1/browse/categories/${id}/playlists?${serializeToURLParameters(queryParams)}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getRecommendations(token, queryParams)
{
    let res = await fetch(`https://api.spotify.com/v1/recommendations?${serializeToURLParameters(queryParams)}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getCategories(token, queryParams = {})
{
    let res = await fetch(`https://api.spotify.com/v1/browse/categories?${serializeToURLParameters(queryParams)}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getCategory(token, id)
{
    let res = await fetch(`https://api.spotify.com/v1/browse/categories/${id}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getRecentlyPlayed(token) {
    const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50"
    let res = await fetch(url, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json()
    return res
}

export async function getPlaylist(token, userId, playlistId)
{
    let res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getUser(token, userId)
{
    let res = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getPlaylistTracks(token, { userId, playlistId, limit = 100, offset = 0 })
{
    let res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?${serializeToURLParameters({limit, offset})}`, {
        method: 'GET',
        headers: makeHeaders(token)
    });
    res = await res.json();
    return res;
}

export async function getAlbums(token, ids)
{
    let res = await fetch (`https://api.spotify.com/v1/albums?ids=${ids.toString()}`, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json();
    return res;
}

export async function getTracks(token, ids)
{
    let res = await fetch (`https://api.spotify.com/v1/tracks?ids=${ids.toString()}`, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json();
    return res;
}

export async function getArtists(token, ids)
{
    let res = await fetch (`https://api.spotify.com/v1/artists?ids=${ids.toString()}`, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json();
    return res;
}

export async function getAudioFeatures(token, ids)
{
    let res = await fetch (`https://api.spotify.com/v1/audio-features/?ids=${ids.toString()}`, {
        method: 'GET',
        headers: makeHeaders(token)
    })
    res = await res.json();
    return res;
}

export function makeUserLoader(token) {
    const batchLoadFn = async ([key]) => {
        const userId = key
        const user = await getUser(token, userId)
        return [user]
    }
    return new Dataloader(batchLoadFn, { batch: false })
}

export function makePlaylistLoader(token) {
    const batchLoadFn = async ([key]) => {
        const { userId, playlistId } = key
        const playlist = await getPlaylist(token, userId, playlistId)
        return [playlist]
    }
    return new Dataloader(batchLoadFn, { batch: false })
}

export function makePlaylistTracksLoader(token) {
    const batchLoadFn = async ([key]) => {
        const tracks = await getPlaylistTracks(token, key)
        return [tracks]
    }
    return new Dataloader(batchLoadFn, { batch: false })
}

export function makeAlbumsLoader(token) {
    const batchLoadFn = async (keys) => {
        const { albums } = await getAlbums(token, keys)
        return albums
    }
    return new Dataloader(batchLoadFn, { maxBatchSize: 20 })
}

export function makeArtistsLoader(token) {
    const batchLoadFn = async (keys) => {
        const { artists } = await getArtists(token, keys)
        return artists
    }
    return new Dataloader(batchLoadFn, { maxBatchSize: 50 })
}

export function makeTracksLoader(token) {
    const batchLoadFn = async (keys) => {
        const { tracks } = await getTracks(token, keys)
        return tracks
    }
    return new Dataloader(batchLoadFn, { maxBatchSize: 50 })
}

export function makeSavedContainsLoader(token) {
    const batchLoadFn = async (keys) => {
        return await getSavedContains(token, keys)
    }
    return new Dataloader(batchLoadFn, { maxBatchSize: 50 })
}

export function makeAudioFeaturesLoader(token) {
    const batchLoadFn = async (keys) => {
        const { audio_features } = await getAudioFeatures(token, keys)
        return audio_features
    }
    return new Dataloader(batchLoadFn, { maxBatchSize: 50 })
}

export function makeCategoriesLoader(token) {
    const batchLoadFn = async ([key]) => {
        return [await getCategories(token, key)]
    }
    return new Dataloader(batchLoadFn, { batch: false, cacheKeyFn: cacheKeyFnForQueryKeys })
}

export function makeCategoryLoader(token) {
    const batchLoadFn = async ([key]) => {
        const category = await getCategory(token, key)
        return [category]
    }
    return new Dataloader(batchLoadFn, { batch: false })
}

export function makeCategoriesPlaylistsLoader(token) {
    const batchLoadFn = async ([{ id, queryParams }]) => {
        return [await getCategoryPlaylists(token, id, queryParams)]
    }
    return new Dataloader(batchLoadFn, { batch: false, cacheKeyFn: cacheKeyFnForQueryKeys })
}
export function makeRecommendationsLoader(token) {
    const batchLoadFn = async ([key]) => {
        return [await getRecommendations(token, key)]
    }
    return new Dataloader(batchLoadFn, { batch: false, cacheKeyFn: cacheKeyFnForQueryKeys })
}

export function makeLoaders(token) {
    return {
        UserLoader : makeUserLoader(token),
        PlaylistLoader : makePlaylistLoader(token),
        PlaylistTracksLoader: makePlaylistTracksLoader(token),
        AlbumsLoader: makeAlbumsLoader(token),
        ArtistsLoader: makeArtistsLoader(token),
        TracksLoader: makeTracksLoader(token),
        SavedContainsLoader: makeSavedContainsLoader(token),
        AudioFeaturesLoader: makeAudioFeaturesLoader(token),
        CategoriesLoader : makeCategoriesLoader(token),
        RecommendationsLoader: makeRecommendationsLoader(token),
        CategoryPlaylistLoader: makeCategoriesPlaylistsLoader(token),
        CategoryLoader: makeCategoryLoader(token)
    }
}