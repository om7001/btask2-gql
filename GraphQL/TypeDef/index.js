const adminType = require('./adminType')
const postType = require('./postType')
const userType = require('./userType')
const followerType = require('./followerType')

const typeDefs = [adminType, postType, userType, followerType]

module.exports = typeDefs;