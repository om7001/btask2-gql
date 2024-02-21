const { skip } = require('graphql-resolvers')
const { User } = require("../Models")

// Auth
const isAuthenticated = async (_, args, { user }) => {
    try {
        const userData = await User.findById(user._id, { password: 0 });
        if (!userData) {
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
        const userData = await User.findById(user._id, { password: 0 });
        if (!userData) {
            throw new Error('Not authenticated1');
        }
        if (userData.roll === 'admin') {
            skip
        } else {
            throw new Error('Not authenticated Admin');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Not authenticated2');
    }
}

module.exports = {
    isAuthenticated, isAuthenticatedAdmin
}