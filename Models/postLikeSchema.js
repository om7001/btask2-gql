const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postLikeSchema = new Schema({
  postId:
  {
    type: Schema.Types.ObjectId,
    ref: "post"
  },
  userId:
  {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
}, {
  timestamps: true,
});

const PostLikes = mongoose.model("postLikes", postLikeSchema);
module.exports = PostLikes;
