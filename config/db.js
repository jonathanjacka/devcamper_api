const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(`Something went wrong - Error: ${error}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
