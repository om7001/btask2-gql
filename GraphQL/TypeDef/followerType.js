const { gql } = require('apollo-server');

const followerType = gql`

type Followers {
    userId: ID
    followerId: ID
    status: statusOption
}

enum statusOption {
    requested
    accepted
    rejected
    blocked
    }

    
type FollowersResult {
    followerId: userResult
    status: statusOption
    userId: userResult
}

input createFollowersInput {
    userId: ID
    userName: String
    search: String
    status: statusRequestOption
}

enum statusRequestOption {
    requested
}

input userOnRequestAnswerInput {
    userId: ID
    followerId: ID
    status: statusAnswerOption    
}

enum statusAnswerOption {
    accepted
    rejected
    blocked 
    }

type userOnRequestAnswerResult {
    userId: ID
    userName: String
    followerId: ID
    status: statusOption
}

type Query {
    getFollower(followerId: ID): [FollowersResult]
    getFollowing(userId: ID): [FollowersResult]!
    getFollowingPost(userId: ID): [postResult]
    getBlockUser(userId: ID): [FollowersResult]!
    getRejectedUser(userId: ID): [FollowersResult]!
    getRequestedUser(userId: ID): [FollowersResult]!
    getFollow(search: String): userResult!
    }

type Mutation {
    createFollowers(input: createFollowersInput): FollowersResult
    userOnRequestAnswer(input: userOnRequestAnswerInput): userOnRequestAnswerResult!
    }
`
module.exports = followerType