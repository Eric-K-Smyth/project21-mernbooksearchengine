const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const signToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email, // Include any user-specific data needed in the token
  };

  // Sign the token
  return jwt.sign(payload, secret, {
    expiresIn: '10h', // Set the token expiration time (e.g., 1 hour)
  });
};

const verifyToken = (token) => {
  try {
    const { data } = jwt.verify(token, secret);
    return data;
  } catch (err) {
    throw new AuthenticationError('Invalid token');
  }
};

const authMiddleware = (context) => {
  const { req } = context;

  if (req) {
    let token = req.headers.authorization;

    if (token) {
      token = token.split(' ')[1];

      if (token) {
        const user = verifyToken(token);
        return { user };
      }
    }
  }

  throw new AuthenticationError('You are not authenticated!');
};

module.exports = { authMiddleware, signToken };

