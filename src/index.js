import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './schema'
import { makeResolvers } from './resolvers'

export function makeSchema(token) {
    return makeExecutableSchema({
        typeDefs,
        // initialize resolvers using new data loaders on each request
        resolvers: makeResolvers(token),
    })
}
export default makeSchema