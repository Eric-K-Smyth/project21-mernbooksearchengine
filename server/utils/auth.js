const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  authMiddleware: function ({ req }) { // Destructure 'req' from context object
    // Get the token from the 'req' object
    const token = req.headers.authorization ? req.headers.authorization.split(' ').pop().trim() : null;

    if (!token) {
      throw new Error('You have no token!');
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Add user data to the context object
      return { user: data };
    } catch (err) {
      console.log('Invalid token');
      throw new Error('Invalid token!');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
