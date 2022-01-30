import crypto from "crypto";
import jwt from "jsonwebtoken";

import { User } from "../model/user.js";

export const signIn = (req, res) => {
  let { number, password } = req.body;

  const hash = crypto
    .createHmac("sha256", password)
    .update("Whats app Clone")
    .digest("hex");

  User.findOne({ number: number }, (err, user) => {
    if (err) {
      return res.json({
        error: "Cannot authenticate user. Please try later",
      });
    }

    if (!user) {
      return res.json({
        error: "User not available",
      });
    }

    if (user.encryptedPassword !== hash) {
      return res.json({
        error: "Enter correct password",
      });
    }

    var token = jwt.sign(
      { _id: user._id, number: user.number, name: user.name },
      "This is my token"
    );

    req.user = {
      _id: user._id,
      token: token,
    };

    return res.json({
      _id: user._id,
      name: user.name,
      number: user.number,
      profilePic: user.profilePic,
      about: user.about,
      token: token,
    });
  });
};

export const signUp = (req, res) => {
  let { password, confirmPassword, number } = req.body;

  if (password && password !== confirmPassword) {
    return res.json({
      error: "Both passwords are not same",
    });
  }

  const hash = crypto
    .createHmac("sha256", password)
    .update("Whats app Clone")
    .digest("hex");
  console.log(hash);

  const user = new User(req.body);

  user.save().then((data) => {
    console.log("User saved");
    res.json({ data: "User saved" });
  });
};

export const isAuthenticated = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, "This is my token");
    console.log(decoded);
    req.user = decoded._id;
    next();
  } catch (err) {
    res.status(401);
    return res.json({ error: "Invalid token" });
  }
};
