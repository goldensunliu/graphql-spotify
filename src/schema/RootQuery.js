const RootQuery = `
  type RootQuery {
    featuredPlaylists(limit: Int, offset: Int): Paging
    """
    Returns the most recent 50 tracks played by a user
    Required Scope: **user-read-recently-played**
    """
    recentlyPlayed: [PlayHistory]
    """
    Get a playlist owned by a Spotify user
    """
    playlist(userId: String!, playlistId: String!): Playlist
    """
    Get an artist
    """
    artist(artistId: String!): Artist
    """
    Get audio features of a track
    """
    audioFeatures(id: String!): AudioFeatures
    """
    Get a track
    """
    track(id: String!): Track
    """
    https://beta.developer.spotify.com/documentation/web-api/reference/browse/get-list-categories/
    Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
    """
    categories(limit: Int, offset: Int, country: String, locale: String): Paging
    """
    Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab)
    https://beta.developer.spotify.com/documentation/web-api/reference/browse/get-category/
    """
    category(id: String!): Category
    """
    Save one or more tracks to the current user’s ‘Your Music’ library
    Required Scope: **user-library-modify**
    """
    recommendations(parameters: RecommendationParameters): RecommendationsResponse
    """
    Get the current user’s top artists or tracks based on calculated affinity.
    (https://beta.developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/)
    Required Scope: **user-top-read**
    """
    top(type: TopType!, limit: Int, offset: Int, time_range: TimeRange): Paging
  }
  type Mutation {
    """
    save a track
    ***returned Track only contains { id, saved }, won't resolve other fields***
    """
    saveTrack(trackId: String!): Track
    """
    save several tracks. Max 50
    ***returned Track only contains { id, saved }, won't resolve other fields***
    """
    saveTracks(trackIds: [String]!): [Track]
    """
    remove several tracks. Max 50
    ***returned Track only contains { id, saved }, won't resolve other fields***
    """
    removeTracks(trackIds: [String]!): [Track]
    """
    follow a playlist
    ***returned Playlist only contains { id, following }, won't resolve other fields***
    assuming id is unique ATM so client with defaultDataIdFromObject will update its cache automatically 
    """
    followPlaylist(ownerId: String!, playlistId: String!, isPublic: Boolean = true): Playlist
    """
    unfollow a playlist
    ***returned Playlist only contains { id, following }, won't resolve other fields***
    assuming id is unique ATM so client with defaultDataIdFromObject will update its cache automatically 
    """
    unfollowPlaylist(ownerId: String!, playlistId: String!): Playlist
  }
`;

export default RootQuery