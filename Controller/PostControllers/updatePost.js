const { Post } = require('../../Models');

const updatePost = async (req, res) => {
    try {
        if (!req.body.title) return res.status(404).json({ error: "please provide proper details!" });
        const data = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, upsert: true, includeResultMetadata: true
            }
        )
        res.status(200).json({
            message: "post created successful",
            data
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = updatePost