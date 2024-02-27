const { User, Post } = require('../../Models');
const { isAuthenticatedAdmin } = require('../../Middleware')
const { combineResolvers } = require('graphql-resolvers');
const { updateInfoMail } = require('../../Middleware/sendMail');

// Admin
const getUsersByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async () => {
        try {
            const usersData = await User.find({ roll: "user" }, { password: 0 });
            if (!usersData || usersData.length === 0) {
                throw new Error("Users Not Found");
            }
            return usersData;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
)
const getUserPostByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { _id }) => {
        try {
            const postData = await Post.find({ createdBy: _id }).populate({ path: "createdBy", select: "-password" }).exec();
            if (!postData) throw new Error("post not available");
            return postData
        } catch (error) {
            console.error(error)
            throw new Error(error.message)
        }
    }
)
const updateUserByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { input }) => {
        try {
            // console.log(input);
            const objectText = Object.entries(input)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? `[${value.join(', ')}]` : value}`)
                .join('\n');

            // console.log(objectText);
            const userData = await User.findById(input._id)
            console.log(userData);
            if (!userData) return new Error("User Not Found")
            Object.assign(userData, input);
            await userData.save();
            updateInfoMail(userData.email, objectText)
                .then((response) => { console.log(response.accepted); })
            // return {
            //     status: true
            // };
            return userData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const deleteUserByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { _id }) => {
        try {
            const userData = await User.findByIdAndDelete(_id);
            if (!userData) {
                throw new Error("User not found!");
            }
            return { message: "user successfully deleted" };
        } catch (error) {
            console.error("Error during delete:", error.message);
            throw new Error(error.message)
        }
    }
)
const getUserByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { _id }) => {
        try {
            const userData = await User.findById({ _id }, { password: 0 });
            if (!userData || userData.length === 0) {
                throw new Error("User not found");
            }
            return userData;
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
)

const getPaginatedUsers = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { input }) => {
        const { page, limit, sortBy, order, search } = input;
        try {
            let query;
            if (search) {
                const regex = new RegExp(search, 'i'); 
                query = {
                    $or: [
                        { firstName: { $regex: regex } },
                        { lastName: { $regex: regex } },
                        { email: { $regex: regex } },
                        { gender: { $regex: regex } },
                        { userName: { $regex: regex } },
                    ],
                    roll: "user"
                };
            } else {
                query = {
                    roll: "user"
                }
            }
            
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: { [sortBy]: order === 'asc' ? 1 : -1 },
            };
            const userData = await User.paginate(query, options);
            if (!userData || !userData.docs || userData.docs.length === 0) {
                return new Error("User not available");
            }

            return userData;
        } catch (error) {
            console.error(error);
            return {
                error: error.message,
            };
        }
    }
);

const getPaginatedPostsByAdmin = combineResolvers(
    isAuthenticatedAdmin,
    async (_, { input }) => {
        const { page, limit, sortBy, order, search } = input;
        try {
            const options = {
                page: page || 1,
                limit: limit || 10,
                // sort: { [sortBy]: order === 'asc' ? 1 : -1 },
            };

            let query = { createdBy: input._id };
            if (search) {
                const regex = new RegExp(search, 'i'); 
                query = { 
                    ...query,
                    title: { $regex: regex }
                };
            }
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
)

const adminResolvers = {
    Query: {
        getUsersByAdmin,
        getUserByAdmin,
        getUserPostByAdmin,
        getPaginatedUsers,
        getPaginatedPostsByAdmin
    },
    Mutation: {
        updateUserByAdmin,
        deleteUserByAdmin
    }
}

module.exports = { adminResolvers }