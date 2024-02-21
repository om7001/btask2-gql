const { User } = require('../../Models');

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        Object.assign(user, req.body);
        await user.save();

        res.json({
            message: "Edit successful",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports = updateUser;
