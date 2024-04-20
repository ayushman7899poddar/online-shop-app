const mongooose = require("mongoose");

const connectDB =  async() => {
    try {
        const conn = await mongooose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb database ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in Mongodb ${error}`);
    }
};

module.exports = connectDB;