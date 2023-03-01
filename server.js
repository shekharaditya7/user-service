require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const env = process.env.NODE_ENV;
const origin =
  env === "production"
    ? "https://this-is-me-74cbf.web.app"
    : "http://localhost:300";

const connectDB = require("./db");

const app = express();

connectDB();

app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors({ origin }));
app.use(cookieParser());
app.get("/", (req, res) => res.send("Server is healthy."));
app.use("/api/auth", require("./Auth/route.js"));
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

const PORT = 5000;
console.log(process.env.NODE_ENV);
app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

process.on("unhandledRejection", (err) => {
  console.log(`An error occurred: ${err.message}`);
});

module.exports = app;
