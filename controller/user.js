import multer from "multer";
import { Conversation } from "../model/conversation.js";
import base64_encode  from '../util/readFile.js';

import { User } from "../model/user.js";

const upload = multer({ dest: "uploads/" });

export const getUser = (req, res) => {
  const { contactNumber } = req.query;
  console.log(contactNumber);
  User.findOne({ number: contactNumber }).select('-encryptedPassword').exec((err, data) => {
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
    console.log(data)
    const user = {
      _id: data._id,
      name: data.name,
      contact: data.contact,
      number: data.number,
      about: data.about,
      profilePic: base64_encode(data.profilePic),
      imageType: data.profilePic.split('.')[data.profilePic.split('.').length - 1]
    }
    return res.json(user);
  });
};

export const getContact = async (req, res) => {
  let { contact } = req.body;
  console.log(contact)
  let convIdList = [];
  contact.map((cont) => {
    convIdList = [...convIdList, `${req.user}${cont}`, `${cont}${req.user}`];
  });

  let conv = await Conversation.find({
    _id: { $in: convIdList },
  }).exec();

  User.find(
    { _id: { $in: contact } },
    { encryptedPassword: 0, contact: 0 }
  ).exec((err, data) => {
    let contacts = [];

    data.forEach((user) => {
      let conversation = conv.find((value) => {
        return (
          value._id === `${user._id}${req.user}` ||
          value._id === `${req.user}${user._id}`
        );
      });

      let lastMessage = conversation?.message.length
        ? conversation.message[conversation.message.length - 1]
        : { value: "" };
      const userInfo = JSON.parse(JSON.stringify(user));
      contacts = [
        ...contacts,
        { ...userInfo, 
          profilePic: base64_encode(userInfo.profilePic),
          imageType: userInfo.profilePic.split('.')[userInfo.profilePic.split('.').length - 1], 
          lastMessage: lastMessage.value },
      ];
    });

    return res.json(contacts);
  });
};

export const updateUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.user }, req.body, (err, user) => {
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
