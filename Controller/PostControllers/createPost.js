const { Post } = require('../../odels');

const createPost = async (req, res) => {
    try {
        req.body.createdby = req.user._id;
        const data = await Post.create(req.body)
        res.status(200).json({
            message: "post created successful",
            data
        });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = createPost