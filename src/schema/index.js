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
import Category from './Category'
import RootQuery from './RootQuery'

const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

const typeDefs = [SchemaDefinition, RootQuery, Playlist, Image, User, PlaylistTrack, Track, Album, Artist, Paging,
    AudioFeatures, PlayHistory, Category, ExternalUrls];

export default typeDefs