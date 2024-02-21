const { User } = require('../../Models');

const createUser = async (req, res) => {
    console.log(req.body);
    try {
        const data = await User.create(
            req.body
        );
        res.status(200).json({
            message: "Data added successfully",
            data: data
        });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};

module.exports = createUser;
