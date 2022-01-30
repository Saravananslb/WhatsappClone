import multer from "multer";

import { User } from "../model/user.js";

const upload = multer({ dest: "uploads/" });

export const getUser = (req, res) => {
  const { contactNumber } = req.query;
  console.log(contactNumber);
  User.findOne({ number: contactNumber }).exec((err, data) => {
    if (err) {
      res.json({ error: "Cannot get Contact" });
    }
    console.log(data);
    res.send(data);
  });
};

export const getProfile = (req, res) => {
  console.log(req.user);
  User.findOne({ _id: req.user }).exec((err, data) => {
    if (err) {
      res.json({ error: "Cannot get User" });
    }
    console.log("DARR", data);
    return res.json(data);
  });
};

export const getContact = (req, res) => {
  let { contact } = req.body;
  User.find(
    { _id: { $in: contact } },
    { encryptedPassword: 0, contact: 0 }
  ).exec((err, data) => {
    return res.json(data);
  });
};

export const updateUser = (req, res) => {
  let { userId } = req.params;

  User.findOneAndUpdate({ _id: userId }, req.body, (err, user) => {
    if (err || !user) {
      return res.json({ error: "Cannot update user" });
    }

    return res.json(req.body);
  });
};

export const uploadImage = (req, res) => {
  console.log(req.body);

  return res.json({
    message: "Uploaded image",
  });
};

export const multerMiddleware = (req, res, next) => {
  console.log(req.body);
  upload.single("avatar");

  next();
};
