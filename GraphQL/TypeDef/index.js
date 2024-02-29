const adminType = require('./adminType')
const postType = require('./postType')
const userType = require('./userType')
const followerType = require('./followerType')
const postLikeType = require('./postLikeTypeDefs')
const postCommentType = require('./postCommentTypeDefs')

const typeDefs = [adminType, postType, userType, followerType, postLikeType, postCommentType]

module.exports = typeDefs;