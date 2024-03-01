const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated } = require("../../Middleware");
const { Post, Follower } = require("../../Models");
const { PostComments } = require("../../Models");
const { PostCommentsLikes } = require("../../Models");
// const { comment } = require("postcss");

const addComment = combineResolvers(
  isAuthenticated,
  async (_, { input }, { user }) => {
    try {
      const { postId, description, parentCommentId, followerId } = input;

      if (followerId) {
        input.userId = user._id
        console.log("input------------", input);
        const followers = await Follower.find({ userId: user._id, followerId: followerId, status: "accepted" });
        if (!followers || followers.length === 0) {
          return new Error("Following Not Found!")
        }
        console.log("followers------", followers)
        const posts = await Post.find({ createdBy: followerId })
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
      }


      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      // Create the comment
      const newComment = new PostComments({
        postId,
        description,
        userId: user._id,
        parentCommentId,
      });

      // Save the comment
      newComment.message = "success";
      const savedComment = await newComment.save();

      // Increment the comment count in the associated post
      post.commentCount += 1;
      await post.save();

      return savedComment;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }
);

const toggleLikeOnPostComment = combineResolvers(
  isAuthenticated,
  async (_, { input }, { user }) => {
    // console.log("🚀 ~ args:", args);
    const { postId, commentId, followerId } = input;

    try {
      if (!postId) return new Error("Invalid postId");
      if (!commentId) return new Error("Invalid commentId");

      if (followerId) {
        input.userId = user._id
        console.log("input------------", input);
        const followers = await Follower.find({ userId: user._id, followerId: followerId, status: "accepted" });
        if (!followers || followers.length === 0) {
          return new Error("Following Not Found!")
        }
        console.log("followers------", followers)
      }

      let commentLikeData;

      const commentData = await PostComments.findOne({ _id: commentId, postId: postId })
      if (!commentData) {
        return new Error("Comments Not Found!")
      }
      // If isLike is true, user wants to like the post
      commentLikeData = await PostCommentsLikes.findOne({
        postId,
        commentId,
        userId: user._id,
      });
      // .populate({ path: "postId", select: "title" })
      // .populate({ path: "userId", select: "firstName" });
      if (!commentLikeData) {
        // If like data doesn't exist, create a new like
        const newLike = await PostCommentsLikes({
          postId,
          commentId,
          userId: user._id,
        });
        newLike.message = "success";
        await newLike.save();
        commentLikeData = newLike; // Assigning newLike to likeData
      } else {
        // If isLike is false, user wants to unlike the post
        commentLikeData = await PostCommentsLikes.findOneAndDelete({
          postId,
          commentId,
          userId: user._id,
        });
        commentLikeData.message = "deleted";
      }
      console.log("🚀 ~ commentLikeData:", commentLikeData);

      return commentLikeData;
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }
);

const getAllCommentsOnPost = combineResolvers(
  isAuthenticated,
  async (_, { input }, { user }) => {
    const { postId, followerId } = input;
    try {

      if (followerId) {
        input.userId = user._id
        // console.log("input------------", input);
        const followers = await Follower.find({ userId: user._id, followerId: followerId, status: "accepted" });
        if (!followers || followers.length === 0) {
          return new Error("Following Not Found!")
        }
        // console.log("followers------", followers)
      }


      // console.log(input);

      const commentData = await PostComments.find({ postId: postId })
        .populate("likeCount");
      // console.log("🚀 ~ getAllCommentsOnPost ~ commentData:", commentData);

      const totalCount = commentData.reduce(
        (sum, comment) => sum + comment.likeCount,
        0
      );
      // console.log("🚀 ~ getAllCommentsOnPost ~ totalCount:", totalCount);

      if (!commentData) return new Error("No comment found");

      return { totalLike: totalCount, CommentResult: commentData };
    } catch (error) {
      console.log("🚀 ~ error:", error);
      throw error; // Throw error to handle it at a higher level
    }
  });

const getAllReplyComment = combineResolvers(
  isAuthenticated, async (_, { input }, { user }) => {
    const { commentId, followerId } = input;
    try {
      if (followerId) {
        input.userId = user._id
        console.log("input------------", input);
        const followers = await Follower.find({ userId: user._id, followerId: followerId, status: "accepted" });
        if (!followers || followers.length === 0) {
          return new Error("Following Not Found!")
        }
        console.log("followers------", followers)
      }


      const commentData = await PostComments.find({
        $or: [{ _id: commentId }, { parentCommentId: commentId }],
      }).populate("likeCount");
      console.log("🚀 ~ getAllReplyComment ~ commentData:", commentData);

      const totalCount = commentData.reduce(
        (sum, comment) => sum + comment.likeCount,
        0
      );

      return { totalLike: totalCount, CommentResult: commentData };

    } catch (error) {
      console.log("🚀 ~ getAllReplyComment ~ error:", error);
    }
  });

const updateRootComment = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    const { reply, commentId } = args.input;
    try {
      if (!commentId) return new Error("invalid commentId");
      // if (!replyId) return new Error("invalid replyId");

      const updatedComment = await PostComments.findByIdAndUpdate(
        { _id: commentId },
        {
          $set: {
            description: reply,
          },
        },
        { new: true }
      );
      console.log("🚀 ~ updatedComment:", updatedComment);
      return updatedComment;
    } catch (error) {
      console.log("🚀 updateSubComment ~ error:", error);
    }
  }
);

const deleteReplies = combineResolvers(
  isAuthenticated,
  async (_, args, { user }) => {
    // console.log("🚀 ~ args:", args)
    const { commentId } = args.input;
    try {
      if (!commentId) return new Error("invalid commentId");

      if (commentId) {
        const newComment = await PostComments.deleteMany({
          $or: [{ _id: commentId }, { parentCommentId: commentId }],
        });
        newComment.message = "deleted";
        return newComment;
      }
    } catch (error) {
      console.log("🚀 deleteReplies ~ error:", error);
    }
  }
);

const postCommentResolver = {
  Query: {
    getAllCommentsOnPost,
    getAllReplyComment,
  },

  Mutation: {
    addComment,
    toggleLikeOnPostComment,
    deleteReplies,
    updateRootComment,
  },
};

module.exports = { postCommentResolver };
