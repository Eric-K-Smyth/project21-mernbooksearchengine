import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks'; // Import ApolloProvider
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'; // Import necessary Apollo Client packages
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Create an Apollo Client instance
const httpLink = createHttpLink({
  uri: '/graphql', // Update with your GraphQL endpoint
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap your entire application with ApolloProvider and provide the client
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
