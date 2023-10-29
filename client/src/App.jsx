import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Auth from './utils/auth'; // Import your Auth module

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Create a custom auth link
const authLink = setContext((_, { headers }) => {
  const token = Auth.getToken(); // Use Auth to get the token from local storage
  console.log('Token from Auth.getToken():', token);
  


  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // Log whether the user is authenticated
  console.log('Is Authenticated:', Auth.loggedIn());

  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;

