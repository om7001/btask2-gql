const { merge } = require("lodash");

const { adminResolvers } = require('./adminResolvers')
const { postResolvers } = require('./postResolvers')
const { userResolvers } = require('./userResolvers')
const { followersResolvers } = require('./followerResolvers');
const { postLikeResolver } = require("./postLikeResolver");
const { postCommentResolver } = require("./postCommentResolver");

const resolvers = merge(
    adminResolvers, postResolvers, userResolvers, followersResolvers, postLikeResolver, postCommentResolver
)

module.exports = resolvers;