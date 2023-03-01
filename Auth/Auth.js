const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret =
  "9c1fbba1a00fe74ba0578553c001c7c6f55ad731addd727c40e03a1fe4cc4d832aa527";

exports.loginStatus = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        const email = decodedToken.email;
        try {
          const user = await User.findOne({ email });
          if (user) {
            res.status(200).json({
              message: "User logged in.",
              user: {
                email: user.email,
                name: user.name,
                token,
              },
            });
          } else {
            res.status(200).json({
              message: "User not found",
            });
          }
        } catch (err) {
          res.status(400).json({
            message: "An error occurred",
            error: err.message,
          });
        }
      }
    });
  } else {
    return res.status(200).json({ message: "User not logged in" });
  }
};

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
        .then((user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user._id, email }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(200).json({
            message: "User successfully created.",
            user: {
              email: user.email,
              name: user.name,
              token,
            },
          });
        })
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
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user._id, email }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(200).json({
            message: "Login successful.",
            user: {
              email: user.email,
              name: user.name,
              token,
            },
          });
        } else
          res.status(401).json({
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
