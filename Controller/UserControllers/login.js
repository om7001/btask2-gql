const { User } = require('../../Models');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        const token = await user.generateAccessToken();
        res.status(200).json({ message: "Login successful", token, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = login;
