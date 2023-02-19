const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const connectDB = require("./db");
connectDB();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/api/auth", require("./Auth/Route"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
});
