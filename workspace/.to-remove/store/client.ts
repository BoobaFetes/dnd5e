import { ApolloClient, InMemoryCache } from '@apollo/client';
import { settings } from '../settings';

const client = new ApolloClient({
  uri: settings.dnd5e.api, // Remplacez par l'URL de votre serveur GraphQL
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});

export default client;
