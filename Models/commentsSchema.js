const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postCommentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming parentCommentId is ObjectId
      ref: "postComments",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postCommentSchema.virtual("likeCount", {
  ref: "postCommentsLikes",
  localField: "_id",
  foreignField: "commentId",
  justOne: false,
  count: true,
});

const PostComments = mongoose.model("postComments", postCommentSchema);
module.exports = PostComments;
