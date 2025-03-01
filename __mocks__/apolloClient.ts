import { ApolloClient, InMemoryCache } from '@apollo/client';

const mockClient = new ApolloClient({
  cache: new InMemoryCache(),
});

export default mockClient;