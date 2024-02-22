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