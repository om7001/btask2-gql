const { skip } = require('graphql-resolvers')

// Auth
const isAuthenticated = async (_, args, { user }) => {
    try {
        // const userData = await User.findById(user._id, { password: 0 });
        if (!user) {
            throw new Error('Not authenticated');
        }
        skip
    } catch (error) {
        console.error(error);
        throw new Error('Not authenticated');
    }
}
const isAuthenticatedAdmin = async (_, args, { user }) => {
    try {
        // const userData = await User.findById(user._id, { password: 0 });
        if (!user) {
            throw new Error('Not authenticated');
        }
        if (user.roll === 'admin') {
            skip
        } else {
            throw new Error('Not authenticated Admin');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Not authenticated');
    }
}

module.exports = {
    isAuthenticated, isAuthenticatedAdmin
}