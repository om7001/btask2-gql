const mongoose = require('mongoose');

const mongoConnection = () => {
    mongoose.connect(process.env.DB_CONECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
};

module.exports = mongoConnection;