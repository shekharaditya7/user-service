const Mongoose = require("mongoose");
const env = process.env;
const localDB =
  env === "production"
    ? `mongodb+srv://shekharaditya7:Indian%407@cluster1.8m2t2fg.mongodb.net/user_db?retryWrites=true&w=majority`
    : "mongodb://localhost:27017/user_db";

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB Connected");
};
module.exports = connectDB;
