const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:"user"
    },
},{
    timestamps:true,
})

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('post', postSchema)
module.exports = Post;