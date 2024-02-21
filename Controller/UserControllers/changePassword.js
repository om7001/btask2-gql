const { User } = require('../../Models')

const changePassword = async (req, res) => {
    console.log("changePassword");
    if (!req.body.oldPassword || !req.body.newPassword) return res.json({ message: "provide proper details!" })
    try {
        const user = await User.findOne({ _id: req.user })
        if (!user) return res.json({ message: "user not found!" })
        const isMatch = await user.isPasswordCorrect(req.body.oldPassword)
        if (!isMatch) return res.json({ message: "wrong old password!" })
        Object.assign(user, { password: req.body.newPassword });
        await user.save();
        res.status(200).json({
            message: "User password change successful",
        });
    } catch (error) {
        res.json({
            error: error.message
        });
        console.log(error);
    }
}

module.exports = changePassword