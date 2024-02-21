const { merge } = require("lodash");

const { adminResolvers } = require('./adminResolvers')
const { postResolvers} = require('./postResolvers')
const { userResolvers } = require('./userResolvers')

const resolvers = merge(
    adminResolvers, postResolvers, userResolvers
)

module.exports = resolvers;