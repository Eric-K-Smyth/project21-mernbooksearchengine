const { User } = require('../models'); // Import your User model

const resolvers = {
  Query: {
    // Implement the 'me' query to retrieve the currently logged-in user
    me: async (_, __, context) => {
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id }).populate('savedBooks');
        return user;
      }
      throw new Error('You are not authenticated.');
    },
  },
  Mutation: {
    // Implement the 'login' mutation
    login: async (_, { email, password }) => {
      // Find the user by email and validate password
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new Error('Invalid email or password.');
      }
      // Return a token for the authenticated user
      return { token: context.authMiddleware.signToken(user), user };
    },
    // Implement the 'addUser' mutation
    addUser: async (_, args) => {
      const user = await User.create(args);
      return { token: context.authMiddleware.signToken(user), user };
    },
    // Implement the 'saveBook' mutation
    saveBook: async (_, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('You are not authenticated.');
    },
    // Implement the 'removeBook' mutation
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error('You are not authenticated.');
    },
  },
};

module.exports = resolvers;

