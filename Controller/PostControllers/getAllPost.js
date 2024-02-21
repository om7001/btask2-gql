const { Post } = require('../../Models');

const getAllPost = async (req, res) => {
    const createdby = req.user;
    try {
        const data = await Post
            .find({
                createdby
            })
            .populate({
                path: "createdby",
                select: "firstname"
            })
        // const data = await Post.find()
        res.status(200).json({
            message: "post created successful",
            data
        });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}


module.exports = getAllPost