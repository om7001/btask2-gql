const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postCommentsLikeSchema = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "postComments" },
  },
  {
    timestamps: true,
  }
);

const PostCommentsLikes = mongoose.model("postCommentsLikes",postCommentsLikeSchema);
module.exports = PostCommentsLikes;
