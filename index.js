import { ApolloServer } from 'apollo-server';

import typeDefs from './src/schema';
import resolvers from './src/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
