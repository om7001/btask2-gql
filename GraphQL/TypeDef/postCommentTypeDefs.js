const { gql } = require("apollo-server");

const postCommentTypeDefs = gql`
  type Comments {
    id: String
    postId: String
    userId: String
    description: String
    message: String
    parentCommentId: String
}

  input addCommentInput {
    postId: String
    description: String
    parentCommentId: String
    followerId: String
  }

  type CommentsLike {
    _id: ID
    postId: String
    commentId: String
    userId: String
    message: String
  }

  input commentsLikeInput {
    postId: String
    commentId: String
    followerId: String
  }

  type CommentResult {
    id: ID
    postId: ID
    userId: String
    description: String
    parentCommentId: String
    likeCount: Int
  }

  input getAllReplyCommentInput {
    commentId: ID
    followerId: String
  }

  input updateRootCommentInput {
    reply: String
    commentId: ID
  }

  input updateSubCommentInput {
    parentCommentId: String
    reply: String
    replyId: String
  }

  input deleteRepliesInput {
    commentId: String
  }

  type deleteMsg {
    message: String
  }

  input likeCountOnCommentInput {
    _id: ID
    postId: ID
  }

  input getCommentAllReplyInput {
    commentId: String
    userId: String
    postId: String
  }

  input getAllCommentsOnPostInput{
    postId: String
    followerId: String
  }

  type getAllCommentsOnPostOutput {
    totalLike: Int
    CommentResult: [CommentResult]
  }

  type getAllReplyCommentOutput {
    totalLike: Int
    CommentResult: [CommentResult]
  }

  type deleteMsg {
    message: String
  }

  type Query {
    getAllCommentsOnPost(input: getAllCommentsOnPostInput): getAllCommentsOnPostOutput
    getAllReplyComment(input: getAllReplyCommentInput): getAllReplyCommentOutput
  }

  type Mutation {
    addComment(input: addCommentInput): Comments
    toggleLikeOnPostComment(input: commentsLikeInput): CommentsLike
    updateRootComment(input: updateRootCommentInput): CommentResult
    deleteReplies(input: deleteRepliesInput): deleteMsg
  }
`;

module.exports = postCommentTypeDefs;
