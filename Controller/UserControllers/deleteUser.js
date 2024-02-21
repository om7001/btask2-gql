const { User } = require('../../Models');

const deleteUser = async (req, res) => {
    const id = req.user;
    try {
        await User.findByIdAndDelete(id),
            // console.log(users.length);
            res.json({ message: "Delete successful" });
    } catch (error) {
        console.log(error)
        res.status(500).send('server error');
    }
}
module.exports = deleteUser