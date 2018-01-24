const RootQuery = `
  type RootQuery {
    featuredPlaylists(limit: Int, offset: Int): Paging
    """
    Returns the most recent 50 tracks played by a user
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
    categories(limit: Int, offset: Int): Paging
    """
    """
    recommendations(parameters: RecommendationParameters): RecommendationsResponse
    
  }
  type Mutation {
    """
    """
    saveTrack(trackId: String!): Track
  }
`;

export default RootQuery