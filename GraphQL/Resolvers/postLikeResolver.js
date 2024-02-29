const { combineResolvers } = require("graphql-resolvers");
const { PostLikes, Follower } = require("../../Models");
const { Post } = require("../../Models");
const { isAuthenticated } = require("../../Middleware");

const toggleLikeOnPost = combineResolvers(
  isAuthenticated,
  async (_, { input }, { user }) => {
    const postId = input.postId;
    console.log("🚀 ~ postId:", postId);

    try {
      if (input.followerId) {
        input.userId = user._id
        console.log("input------------", input);
        const followers = await Follower.find({ userId: user._id, followerId: input.followerId, status: "accepted" });
        if (!followers || followers.length === 0) {
          return new Error("Following Not Found!")
        }
        console.log("followers------", followers)
        const posts = await Post.find({ createdBy: input.followerId })
        if (!posts || posts.length === 0) {
          return new Error("Post not found")
        };
        const followingUserPostId = posts.map(post => post._id);
        console.log(followingUserPostId);
        // console.log("posts _id------", posts.map(post => post._id));
        // console.log("posts------", posts);

        const stringPostId = String(postId)
        const stringFollowingUserPostId = String(followingUserPostId)

        if (!postId || !stringFollowingUserPostId.includes(stringPostId)) {
          return new Error("Invalid postId");
        }
      } else {
        const post = await Post.findById(postId);
        if (!post) return new Error("Post not found");
      }


      let likeData;
      likeData = await PostLikes.findOne({
        postId,
        userId: user._id
      });
      if (!likeData) {
        // If like data doesn't exist, create a new like
        const newLike = PostLikes({
          postId,
          userId: user._id
        });
        newLike.message = "success";
        await newLike.save();
        likeData = newLike;
        // Assigning newLike to likeData
      } else {
        // If isLike is false, user wants to unlike the post
        likeData = await PostLikes.findOneAndDelete({
          postId,
          userId: user._id
        });
        likeData.message = "deleted";
      }
      console.log("🚀 ~ likeData🚀 ~  deleted :", likeData);
      console.log("🚀 ~ likeData:", likeData);

      return likeData;
    } catch (error) {
      console.log("Error toggling like:", error);
      throw error; // Throw the error for proper error handling
    }
  }
);

const postLikeResolver = {
  Mutation: {
    toggleLikeOnPost,
  },
};

module.exports = { postLikeResolver };
