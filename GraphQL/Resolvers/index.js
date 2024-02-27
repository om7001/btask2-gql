const { merge } = require("lodash");

const { adminResolvers } = require('./adminResolvers')
const { postResolvers} = require('./postResolvers')
const { userResolvers } = require('./userResolvers')
const { followersResolvers } = require('./followerResolvers')

const resolvers = merge(
    adminResolvers, postResolvers, userResolvers, followersResolvers
)

module.exports = resolvers;