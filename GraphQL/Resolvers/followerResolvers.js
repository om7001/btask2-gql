const { User } = require('../../Models');
const { Follower } = require('../../Models');
const { Post } = require('../../Models');
const { isAuthenticated } = require('../../Middleware/index')
const { combineResolvers } = require('graphql-resolvers')

const createFollowers = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        try {
            // if (!user || !user.userName) {
            //     throw new Error("User data is missing or incomplete.");
            // }

            input.userId = user._id;
            if (!input.userName || input.userName === user.userName) {
                throw new Error("Invalid or missing userName in input.");
            }

            const followedUser = await User.findOne({ userName: input.userName });
            if (!followedUser) {
                throw new Error("User not found.");
            }

            const existingFollowerRequested = await Follower.findOne({ userId: user._id, followerId: followedUser._id, status: "requested" })
            if (existingFollowerRequested) {
                throw new Error("You have already requested to follow this user.");
            }

            input.followerId = followedUser._id;
            const newFollower = await Follower.create(input)
                
            await newFollower.populate({ path: "userId", select: "userName" })
            await newFollower.populate({ path: "followerId", select: "userName" })

            return newFollower;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);


const userOnRequestAnswer = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        try {
            input.userId = user._id
            console.log(input)

            const userData = await User.findOne({ _id: input.followerId });
            if (!userData) {
                return new Error("User not found.");
            }
            console.log("userData-------" + userData._id);

            const followingUser = await Follower.findOneAndUpdate({ followerId: input.userId }, { status: input.status }, { new: true })
            console.log("followingUser-------", followingUser);

            return followingUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

const getFollower = combineResolvers(
    isAuthenticated,
    async (_, input, { user }) => {
        console.log(user._id);
        try {
            input.userId = user._id;
            console.log(input.followerId);
            const followerData = await Follower.find({ userId: user._id, status: "accepted" })
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "followerId", select: "userName" })
                .exec();

            console.log(followerData);

            if (!followerData || followerData.length === 0) {
                throw new Error("Follower Not Available");
            }
            console.log("----------------", followerData);
            return followerData;
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            };
        }
    }
);


const getFollowing = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        console.log(user._id);
        try {
            const followingData = await Follower.find({ followerId: user._id, status: "accepted" })
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "followerId", select: "userName" })
                .exec();
            if (!followingData) return new Error("User Not Found")
            if (followingData.length === 0) return new Error("User is Not Following Any One.")
            console.log("----------------", followingData);
            // const followingData = userData.status
            return followingData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)

const getBlockUser = combineResolvers(
    isAuthenticated,
    async (_, input, { user }) => {
        console.log(user._id);
        try {
            input.userId = user._id
            const followingData = await Follower.find({ followerId: user._id, status: "blocked" })
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "followerId", select: "userName" })
                .exec();
            if (!followingData) return new Error("User Not Found")
            if (followingData.length === 0) return new Error("User is Not Blocked Any One.")
            console.log("----------------", followingData);
            // const followingData = userData.status
            return followingData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)

const getRejectedUser = combineResolvers(
    isAuthenticated,
    async (_, input, { user }) => {
        console.log(user._id);
        try {
            input.userId = user._id
            const followingData = await Follower.find({ userId: user._id, status: "rejected" })
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "followerId", select: "userName" })
                .exec();
            if (!followingData) return new Error("User Not Found")
            console.log("----------------", followingData);
            if (followingData.length === 0) return new Error("User is Not Rejected Any One.")
            // const followingData = userData.status
            return followingData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)

const getRequestedUser = combineResolvers(
    isAuthenticated,
    async (_, input, { user }) => {
        console.log(user._id);
        try {
            input.userId = user._id
            const followingData = await Follower.find({ followerId: user._id, status: "requested" })
                .populate({ path: "userId", select: "userName" })
                .populate({ path: "followerId", select: "userName" })
                .exec();
            if (!followingData) return new Error("User Not Found")
            console.log("----------------", followingData);
            if (followingData.length === 0) return new Error("User is Not Rejected Any One.")
            // const followingData = userData.status
            return followingData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)

const getFollowingPost = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        console.log(user._id);
        try {
            const followers = await Follower.find({ userId: user._id, status: "accepted" }).exec();
            console.log(followers)
            const followingUsers = followers.map(follow => follow.followerId);
            console.log("followingUsers", followingUsers)

            const posts = await Post.find({
                $or: [
                    { createdBy: user._id },
                    { createdBy: { $in: followingUsers } }
                ]
            }).populate({ path: 'createdBy', select: '-password' }).exec();

            console.log(posts);
            return posts
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)


const getFollow = combineResolvers(
    isAuthenticated,
    async (_, input, { user }) => {
        try {
            if (!input || !input.search) {
                throw new Error("Invalid input. Please provide a search term.");
            }

            let query = {};
            const regex = new RegExp(input.search, 'i');
            query = {
                userName: { $regex: regex }
            };
            query._id = { $ne: user._id };
            // console.log(query);
            const followedUser = await User.findOne(query);
            if (!followedUser) {
                throw new Error("User not found.");
            }
            return followedUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);



const followersResolvers = {
    Query: {
        getFollower,
        getFollowing,
        getFollowingPost,
        getBlockUser,
        getRejectedUser,
        getRequestedUser,
        getFollow
    },
    Mutation: {
        createFollowers,
        userOnRequestAnswer
    }
}

module.exports = { followersResolvers }