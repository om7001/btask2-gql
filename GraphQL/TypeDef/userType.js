const { gql } = require('apollo-server');

const userType = gql`

    scalar Date

    type User{
        _id: ID!
        profile: String
        firstName: String
        lastName: String
        userName: String!
        email: String!
        password: String!
        active: Boolean
        isVerified:Boolean
        roll: rollOption
        gender: genderOption
        age: Int
        dateofbirth: Date
        # followers: Int
        # following: Int
        # blocked_users: Int
        hobbies: [String]
        createdAt: Date
        updatedAt: Date
    }

    enum rollOption{
        user
        admin
    }

    enum genderOption{
        male
        female
    }

    type userResult{
        _id: ID
        profile: String
        firstName: String
        lastName: String
        userName: String
        email: String
        active: Boolean
        roll: rollOption
        gender: genderOption
        age: Int
        dateofbirth: Date
        hobbies: [String]
        followers: Int
        following: Int
        blockedUsers: Int
        request: Int
        createdAt: Date
        updatedAt: Date
    }

    type userId{
        _id: ID
    }

    

    input loginInput{
        email: String!
        password: String!
    }

    type LoginResult{
        _id: ID!
        email: String!
        accessToken: String!
        active: Boolean
        isVerified:Boolean
        roll: rollOption
    }

    input createUserInput{    
        firstName: String
        lastName: String
        userName: String!
        email: String!
        password: String       
        roll: rollOption
        gender: genderOption
        age: Int
        dateofbirth: Date
        hobbies: [String]       
    }
   
    input updateUserInput{          
        firstName: String
        lastName: String   
        gender: genderOption
        age: Int
        dateofbirth: Date
        hobbies: [String]      
    }

    type deleteMsg{
        message: String
    }

    input changePasswordInput{
        oldPassword: String!
        newPassword: String!
    }

    input userVerifyInput{
        token: String
    }

    type status{
        isVerified:Boolean
    }

    type fpResult{
        status: Boolean
    }

    input forgotpassword{
        token: String!
        password: String!
    }

    input UploadProfilePhotoInput {
        url: String!
      }

      type getProfilePhotoResult{
        url: String!
    }

    type Query{
        getUser: userResult!
        getProfilePhoto: getProfilePhotoResult!
    }

    type Mutation{
        createUser(input: createUserInput): userResult!
        loginUser(input: loginInput): LoginResult!
        updateUser(input: updateUserInput): userResult!
        deleteUser: deleteMsg!
        changePassword(input: changePasswordInput): userResult!
        userVerify(input: userVerifyInput): status
        sendForgotPasswordMail(email: String!): fpResult!
        forgotPassword(input: forgotpassword!): fpResult!
        uploadProfilePhoto(input: UploadProfilePhotoInput!): String
        tokenVerification(token: String!): Boolean
        resentVerificationMail(email: String!): Boolean

    }
`

module.exports = userType