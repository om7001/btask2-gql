const { gql } = require('apollo-server');

const adminType = gql`
   
    input updateUserByAdminInput{
        _id: ID!
        firstName: String
        lastName: String        
        active: Boolean      
        gender: genderOption
        age: Int
        dateofbirth: Date
        hobbies: [String]
    }

    input getPaginatedUsersInput{
        page: Int!
        limit: Int!
        sortBy: String!
        order: String!
        search: String
    }

    type UserPagination {
        docs: [userResult]!
        totalDocs: Int!
        limit: Int!
        page: Int!
        totalPages: Int!
        nextPage: Int
        prevPage: Int
    }

    input getPaginatedPostByAdminInput{
        _id: ID!
        page: Int!
        limit: Int!
        sortBy: String
        order: String
        search: String
    }

    type PostPagination{
        docs: [postResult]!
        totalDocs: Int!
        limit: Int!
        page: Int!
        totalPages: Int!
        nextPage: Int
        prevPage: Int
    }

    type Query{
        getUsersByAdmin: [userResult!]!
        getUserByAdmin(_id: ID!): userResult!
        getUserPostByAdmin(_id: ID!): [postResult!]!
        getPaginatedUsers(input: getPaginatedUsersInput): UserPagination
        getPaginatedPostsByAdmin(input: getPaginatedPostByAdminInput): PostPagination
    }

    type Mutation{
        updateUserByAdmin(input: updateUserByAdminInput): userResult!
        deleteUserByAdmin(_id: ID!): deleteMsg!
    }
`

module.exports = adminType