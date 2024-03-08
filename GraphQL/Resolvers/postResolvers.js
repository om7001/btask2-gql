const { Post, PostComments } = require('../../Models');
const { isAuthenticated } = require('../../Middleware')
const { combineResolvers } = require('graphql-resolvers')

// Post
const createPost = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        try {
            input.createdBy = user._id
            console.log(input.createdBy);
            const postData = await Post.create(input)
            if (!postData) return new Error("Post Not Created")
            return postData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const getPost = combineResolvers(
    isAuthenticated,
    async (_, { _id }, { user }) => {
        try {
            const postData = await Post.findOne({
                createdBy: user._id,
                _id
            }).populate({ path: 'createdBy', select: '-password' });
            if (!postData) return new Error("Post Not Available")
            return postData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const getAllPost = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        try {
            const postData = await Post.find({ createdBy: user._id }).populate({ path: "createdBy", select: "-password" }).exec();
            if (!postData) return new Error("Post Not Available")
            return postData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const updatePost = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        if (!input.title) throw new Error("Title is Mandatory!");
        try {
            const postData = await Post.findOneAndUpdate(
                {
                    createdBy: user._id,
                    _id: input._id
                },
                input,
                { new: true }
            );
            if (!postData) return new Error("Post Not Found!")
            return postData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const deletePost = combineResolvers(
    isAuthenticated,
    async (_, { _id }, { user }) => {
        try {
            console.log(_id);
            const deleteComment = await PostComments.deleteMany({ postId: _id });
            const deletePost = await Post.findByIdAndDelete({
                createdBy: user._id,
                _id: _id,
            });
console.log(deleteComment);
            if (!deleteComment) return new Error("comments not found");

            if (!deletePost) return new Error("post not found");
            return { message: "delete" };
        } catch (error) {
            console.error("Error during delete:", error);
            return {
                message: error.message
            };
        }
    }
)





const getPaginatedPosts = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        const { page, limit } = input;
        try {
            const options = {
                page: page || 1,
                limit: limit || 10,
            };
            const query = { createdBy: user._id };
            const postData = await Post.paginate(query, options);
            const populatedData = await Post.populate(postData.docs, { path: "createdBy", select: "firstName lastName" });

            if (!populatedData || populatedData.length === 0) {
                return new Error("Post not available");
            }

            return {
                docs: populatedData,
                totalDocs: postData.totalDocs,
                limit: postData.limit,
                page: postData.page,
                totalPages: postData.totalPages,
                nextPage: postData.nextPage,
                prevPage: postData.prevPage,
            };
        } catch (error) {
            console.error(error);
            return {
                error: error.message,
            };
        }
    }
);


const postResolvers = {
    Query: {
        getPost,
        getAllPost,
        getPaginatedPosts
    },
    Mutation: {
        createPost,
        updatePost,
        deletePost
    }
}

module.exports = { postResolvers }