const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas'); // Make sure you import your typeDefs and resolvers
const { authMiddleware } = require('./utils/auth'); // Import the authMiddleware

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    ...authMiddleware(req),
  }),
});

server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
