const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    followerId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    status:{
        type: String,
        enum: ["requested", "accepted", "rejected", "blocked"]
    }
}, {
    timestamps: true
});

const Follower = mongoose.model('follower', followerSchema)
module.exports = Follower;