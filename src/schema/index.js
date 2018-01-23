import Playlist from './Playlist'
import Image from './Image'
import User from './User'
import PlaylistTrack from './PlaylistTrack'
import Track from './Track'
import Album from './Album'
import Artist from './Artist'
import Paging from './Paging'
import AudioFeatures from './AudioFeatures'
import PlayHistory from './PlayHistory'
import ExternalUrls from './ExternalUrls'

const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

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
    
  }
  type Mutation {
    """
    """
    saveTrack(trackId: String!): Track
  }
`;

const typeDefs = [SchemaDefinition, RootQuery, Playlist, Image, User, PlaylistTrack, Track, Album, Artist, Paging,
    AudioFeatures, PlayHistory, ExternalUrls];

export default typeDefs