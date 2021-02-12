const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }
  catch (err) {
    const error = new Error("Could not connect to database");
    error.status = 404;
    return next(error)
  }  
};

module.exports = connectDB;
