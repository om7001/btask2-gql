const { gql } = require('apollo-server');

const postType = gql`
    type Post {
        _id: ID!
        title: String!
        description: String
        createdBy: String
        createdAt: Date
    }

    input createPostInput {
        title: String!
        description: String
    }

    input updatePostInput{
        _id: ID!
        title: String
        description: String
    }

    type postResult{
        _id: ID!
        title: String!
        description: String
        createdBy: userResult
        createdAt: Date
    }

    input getPaginatedPostsInput{
        page: Int!
        limit: Int!
    }

    type PostPagination {
        docs: [postResult]!
        totalDocs: Int!
        limit: Int!
        page: Int!
        totalPages: Int!
        nextPage: Int
        prevPage: Int
    }

    type Query{
        getPost(_id: ID!): postResult!
        getAllPost: [postResult!]!
        getPaginatedPosts(input: getPaginatedPostsInput): PostPagination
    }

    type Mutation{
        createPost(input: createPostInput): Post!
        updatePost(input: updatePostInput): Post!
        deletePost(_id: ID!): deleteMsg!
    }
`


module.exports = postType