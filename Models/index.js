const Post = require("./postSchema")
const User = require("./userSchema")
const Follower = require("./followerSchema")
const PostLikes = require("./postLikeSchema")
const PostComments = require("./commentsSchema")
const PostCommentsLikes = require("./commentsLikeSchema")

module.exports = {
    User,
    Post,
    Follower,
    PostLikes,
    PostComments,
    PostCommentsLikes
}