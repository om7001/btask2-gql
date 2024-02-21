require('dotenv').config();
const jwt = require('jsonwebtoken')
const express = require('express');
const { ApolloServer, gql, AuthenticationError, ApolloError, } = require('apollo-server-express');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const connectMongoDB = require('./db.js');
const cors = require('cors');
const path = require('path');

const typeDefs = require('./GraphQL/TypeDef');
const resolvers = require('./GraphQL/Resolvers');




const app = express();
app.use(express.json({ limit: '100mb', extended: true }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: async ({ req }) => {
        const token = req.headers.authorization || "";
        if (!token) {
            return { user: null, error: "Token not provided" };
        }

        try {
            const decodedUser = jwt.verify(token, process.env.ACCESS_KEY_SECRET,
                (err, decodedUser) => {
                    if (err) {
                        console.log(err);
                        throw new ApolloError(
                            "Invalid or expired token.",
                            "UNAUTHENTICATED"
                        );
                    }
                    return { user: decodedUser || null };
                });
            return { user: decodedUser.user, error: null };
        } catch (error) {
            console.log(error.message);
            return { user: null, error: "Invalid token" };
        }
    }
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer().then(() => {
    const PORT = process.env.PORT || 4000; // Set a default port if not provided
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/graphql`);
    });
});

connectMongoDB();






// const express = require("express");
// const path = require("path");
// const {
//     ApolloServer,
//     gql,
//     AuthenticationError,
//     ApolloError,
// } = require("apollo-server-express");
// const {
//     userTypeDefs,
//     adminTypeDefs,
//     postTypeDefs,
// } = require("./schema/typedefs/index");
// const {
//     adminResolver,
//     userResolvers,
//     postResolvers,
// } = require("./schema/schemResolvers/index");
// const mongooseConnection = require("./mongoose");

// const combineTypeDefs = [userTypeDefs, adminTypeDefs, postTypeDefs];
// const combineresolvers = merge(adminResolver, userResolvers, postResolvers);

// const schema = makeExecutableSchema({
//     typeDefs: combineTypeDefs,
//     resolvers: combineresolvers,
// });
// const server = new ApolloServer({
//     schema,
//     context: ({ req }) => {
//         const token = req.headers.token || "";
//         console.log("🚀 ~ token:", token);

//         // Verify and decode the token
//         let decodedToken = null;
//         if (token) {
//             try {
//                 // console.log("🚀 ~ token:", token);
//                 decodedToken = jwt.verify(
//                     token,
//                     process.env.ACCESS_TOKEN_SECRET,
//                     (err, decodedToken) => {
//                         if (err) {
//                             console.log(
//                                 "🚀 ~ errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:",
//                                 err
//                             );
//                             throw new ApolloError(
//                                 "Invalid or expired token.",
//                                 "UNAUTHENTICATED"
//                             );
//                         }
//                         return { token: decodedToken || null };
//                     }
//                 );

//                 console.log("🚀 ~ decodedToken:", decodedToken);
//                 return decodedToken;
//             } catch (error) {
//                 console.log("🚀 ~ error 123:", error);
//                 // Handle token verification errors
//                 throw new ApolloError("Invalid or expired token.", "UNAUTHENTICATED");
//             }
//         } else {
//             return;
//         }

//         // Return the decoded token or null if it's not available
//     },
// });

// const app = express();
// app.use(express.json({ limit: "100mb", extended: true }));
// app.use(express.urlencoded({ limit: "100mb", extended: true }));
// // app.use("/", express.static("uploads" ));
// app.use("/static", express.static(path.join(__dirname, "uploads")));
// // Await the server.start() before applying the middleware
// async function startServer() {
//     await server.start();
//     server.applyMiddleware({ app });
// }

// // Call the startServer function
// startServer()
//     .then(() => {
//         // Set up your server to listen on a specific port
//         const PORT = 3000;
//         app.listen(PORT, () => {
//             console.log(`Server is running at http://localhost:${PORT}/graphql`);
//         });
//     })
//     .catch((err) => {
//         console.log("🚀 ~ err:", err);
//         console.log(err);
//     });
// mongooseConnection();