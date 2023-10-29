const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';

const signToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email, // Include any user-specific data needed in the token
  };

  // Verify that the secret key is correct
  // Verify that the payload is correctly structured
  // Verify that the expiration time is set as expected
  return jwt.sign(payload, secret, {
    expiresIn: '10h', // Set the token expiration time 
  });

};

const verifyToken = (token) => {
  try {
    const { id, email } = jwt.verify(token, secret);
    console.log('Decoded Data:', { id, email }); // Log the decoded data
    return { id, email };
  } catch (err) {
    console.error('Error verifying token:', err); // Log the error
    throw new AuthenticationError('Invalid token');
  }
};

const authMiddleware = (context) => {
  const { req } = context;

  if (req) {
    let token = req.headers.authorization;
    console.log('Received Token:', token); // Log the received token

    if (token) {
      token = token.split(' ')[1];
      console.log('Split Token:', token); // Log the split token

      if (token) {
        try {
          const user = verifyToken(token);
          console.log('User authenticated:', user); // Log the user
          return { user };
        } catch (err) {
          console.error('Error authenticating user:', err); // Log the error
        }
      }
    }
  }

  console.error('Authentication failed: You are not authenticated!'); // Log the error
  throw new AuthenticationError('You are not authenticated!');
};

module.exports = { authMiddleware, signToken, verifyToken };


