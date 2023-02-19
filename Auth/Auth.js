const User = require("../model/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res, next) => {
  const { email = "", password = "", name = "" } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json({ message: "Invalid input." });
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({ message: "Email is invalid." });
  }

  try {
    const user = await User.findOne({ email });
    if (user) return res.status(401).json({ message: "Email already exists." });
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        email,
        password: hash,
        name,
      })
        .then((user) =>
          res.status(200).json({
            message: "User successfully created.",
            user,
          })
        )
        .catch((err) =>
          res.status(401).json({
            message: "User not successfully created.",
            error: err.mesage,
          })
        );
    });
  } catch (err) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;
    if (!password || !email) {
      return res.status(400).json({ message: "Invalid input." });
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ message: "Email is invalid." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        result
          ? res.status(200).json({
              message: "Login successful.",
              user,
            })
          : res.status(401).json({
              message: "Password is incorrect.",
            });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
