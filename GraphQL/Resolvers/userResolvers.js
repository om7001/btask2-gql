const jwt = require('jsonwebtoken')
const { sendWelcomeEmail } = require("../../Middleware")
const { User } = require('../../Models');
const { isAuthenticated } = require('../../Middleware')
const { combineResolvers } = require('graphql-resolvers')
const fs = require('fs');
const { error } = require('console');

// User
const getUser = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        try {
            const userData = await User.findById(user._id, { password: 0 }).populate('followers following blockedUsers request');
            if (!userData) throw new ApolloError("Users not found")
            return userData;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
)
const deleteUser = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        try {
            const userData = await User.findByIdAndDelete(user._id);
            if (!userData) {
                throw new Error("User not found");
            }
            return { message: "delete" };
        } catch (error) {
            console.error("Error during delete:", error);
            return {
                message: "Error during delete",
                error: error.message
            };
        }
    }
)
const changePassword = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        if (!input.oldPassword || !input.newPassword) throw new Error("provide proper details!");
        try {
            const userData = await User.findById(user._id)
            if (!userData) throw new Error("user not found!");
            const isMatch = await userData.isPasswordCorrect(input.oldPassword)
            if (!isMatch) throw new Error("wrong old password!");
            Object.assign(userData, { password: input.newPassword });
            await userData.save();
            return userData;
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message)

        }
    }
)
const updateUser = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        try {
            const userData = await User.findById(user._id)
            if (!userData) return "user not found"
            Object.assign(userData, input);
            await userData.save();
            return userData
        } catch (error) {
            console.error(error);
            return {
                error: error.message
            }
        }
    }
)
const createUser = async (_, { input }) => {
    try {
        const user = new User(input);
        await user.save();
        if (!user) return "User not created";
        const verificationToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_KEY_SECRET,
            {
                expiresIn: process.env.ACCESS_KEY_EXPIRY
            }
        )
        const url = `verify/${verificationToken}`
        sendWelcomeEmail(user.email, url)
            .then((response) => { console.log(response.accepted); })
        return user;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
const loginUser = async (_, { input }) => {

    const { email, password } = input
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return new Error("User is not Registration")
        }
        if (user.isVerified !== true) {
            return new Error("NOT_VERIFIED")
        }
        if (user.active !== true) {
            return new Error("User is Not Active")
        }
        const isMatch = await user.isPasswordCorrect(password)
        if (!isMatch) {
            return new Error("Email and Password Does Not Match")
        }
        console.log(user);
        const accessToken = await user.generateAccessToken();
        user.accessToken = accessToken
        return user
    } catch (error) {
        console.log(error);
        return {
            message: "User does Not login ",
            error: error
        }

    }
}

const userVerify = async (_, { input }) => {
    try {
        let decoded = {}
        try {
            decoded = jwt.verify(input.token, process.env.ACCESS_KEY_SECRET);
        } catch (error) {
            console.log(error.message);
            return new Error(error.message);
        }
        // const decoded = jwt.verify(input.token, process.env.ACCESS_KEY_SECRET);
        const data = await User.findById(decoded._id);
        if (data.isVerified) return new Error("ISVERIFIED")
        const userData = await User.findByIdAndUpdate(decoded._id, { isVerified: true });
        if (!userData) return { isVerified: false };

        console.log(userData.isVerified);
        return { isVerified: true };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

const tokenVerification = async (_, { token }) => {
    try {
        jwt.verify(token, process.env.ACCESS_KEY_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

const sendForgotPasswordMail = async (_, { email }) => {
    try {
        const user = await User.findOne({ email }, { email: 1, _id: 1 });
        if (!user) return { status: false }
        // if (!user) return new Error("Email is Not Registered")
        const verificationToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_KEY_SECRET,
            {
                expiresIn: process.env.ACCESS_KEY_EXPIRY
            }
        )
        const url = `forgotpassword/${verificationToken}`
        sendWelcomeEmail(email, url)
            .then((response) => { console.log(response.accepted); })
        return {
            status: true
        };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const forgotPassword = async (_, { input }) => {
    try {
        const { token, password } = input;
        const decoded = jwt.verify(token, process.env.ACCESS_KEY_SECRET);
        const userData = await User.findById(decoded._id);
        // console.log(userData);
        if (!userData) return { status: false, message: 'User not found' };
        userData.password = password;
        await userData.save();
        return { status: true };
    } catch (error) {
        // console.log(error.message);
        throw new Error(error.message);
    }
}

const uploadProfilePhoto = combineResolvers(
    isAuthenticated,
    async (_, { input }, { user }) => {
        const { _id } = user
        let base64String = input.url;
        let base64Image = base64String.split(";base64,").pop();
        const imgName = `${+new Date()}.png`;

        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads", { recursive: true });
        }

        fs.writeFileSync(`./uploads/${imgName}`, base64Image, {
            encoding: "base64",
        });

        const userData = await User.findOneAndUpdate({ _id }, { profile: imgName }, { new: true })
        if (!userData) {
            return new Error("Invalid User!");
        } else {
            return imgName;
        }
    }
);

const getProfilePhoto = combineResolvers(
    isAuthenticated,
    async (_, args, { user }) => {
        const { _id } = user
        try {
            const userData = await User.findById(_id);
            if (!userData || !userData.profile) {
                return null;
            }
            console.log("profile: ", userData.profile);
            return {
                url: userData.profile
            }
        } catch (error) {
            console.error('Error retrieving profile:', error);
            throw new Error('Failed to retrieve profile');
        }
    }
);

const resentVerificationMail = async (_, { email }) => {
    try {
        // const { email } = input;
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) throw new Error("You have Not Registered!");
        const verificationToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_KEY_SECRET,
            {
                expiresIn: process.env.ACCESS_KEY_EXPIRY
            }
        );
        const url = `verify/${verificationToken}`;
        await sendWelcomeEmail(user.email, url);
        return true;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};



const userResolvers = {
    Query: {
        getUser,
        getProfilePhoto
    },
    Mutation: {
        createUser,
        loginUser,
        updateUser,
        deleteUser,
        changePassword,
        userVerify,
        sendForgotPasswordMail,
        forgotPassword,
        uploadProfilePhoto,
        tokenVerification,
        resentVerificationMail
    }
}

module.exports = { userResolvers }