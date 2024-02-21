const { Post } = require('../../Models');
const getOnePost = async (req, res) => {
    try {
        const data = await Post.findById(req.params.id)
        res.status(200).json({
            message: "post created successful",
            data
        });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = getOnePost