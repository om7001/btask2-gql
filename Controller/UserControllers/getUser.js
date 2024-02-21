const { User } = require('../../Models');

const getUser = async (req, res) => {
    const id = req.user;
    try {
        const data = await User.findOne(id, { password: 0 });
        if (!data) return res.json({ message: "does not find user" });
        console.log(data);
        res.json({ data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = getUser