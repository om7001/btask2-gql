const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    profile:{
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    active: {
        type: Boolean,
        default: true,
        enum:[true,false]
    },
    isVerified:{
        type: Boolean,
        default: true
    },
    roll: {
        type: String,
        enum: ["user","admin"],
        default:"user"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    age: {
        type: Number,
        min: 18
    },
    dateofbirth: {
        type: Date
    },
    hobbies: {
        type: [String],
    },

}, {
    timestamps: true,
})


userSchema.methods.generateAccessToken = async function () {
    try {
        const accessToken = await jwt.sign(
            { _id: this._id },
            process.env.ACCESS_KEY_SECRET,
            {
                expiresIn: process.env.ACCESS_KEY_EXPIRY,
            }
        );
        return accessToken;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Failed to generate access token');
    }
};

userSchema.pre("save", async function (next) {
    if (!this.password) return next();

    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error);
        }
    }

    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('user', userSchema)
module.exports = User;