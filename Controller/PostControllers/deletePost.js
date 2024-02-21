const { Post } = require('../../Models');

const deletePost = async (req, res) => {
    try {
        const data = await Post.findOneAndDelete({
            createdby: req.user._id,
            _id: req.params.id
        })
        res.status(200).json({
            message: "post deleted successful",
            data
        });
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = deletePost