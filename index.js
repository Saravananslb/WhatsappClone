import express from "express";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import { setConversation } from "./controller/conversation.js";

import { Conversation } from "./model/conversation.js";
import { User } from "./model/user.js";
import { authRouter } from "./routes/auth.js";
import { conversationRouter } from "./routes/conversation.js";
import { userRouter } from "./routes/user.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(authRouter);
app.use(conversationRouter);
app.use(userRouter);

const server = app.listen(8000, () => {
  console.log("APP STARTED");
});

mongoose.connect("mongodb://localhost:27017/WatsAppClone", () => {
  console.log("DB connected");
});

let users = {};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("CLIENT CONNECTED");
  ws.on("message", function message(data) {
    let { senderId, recieverId, message, type } = JSON.parse(data);
    console.log(JSON.parse(data));
    users[senderId] = ws;
    if (type === "send") {
      setConversation(senderId, recieverId, message, users[recieverId]);
    }
  });
});

// let user = new User({
//   name: "Jenifer",
//   about: "Its Jenifer",
//   contact: [1, 2, 3, 4],
//   profilePic: "ProfilePic",
// });

// user.save().then(() => {
//   console.log("data");
// });

// let con = new Conversation({
//   _id: "123abc",
//   message: [
//     {
//       value: "Hi",
//       senderId: "123",
//       recieverId: "abc",
//     },
//     {
//       value: "Hello",
//       recieverId: "123",
//       senderId: "abc",
//     },
//     {
//       value: "I am Jenifer",
//       senderId: "123",
//       recieverId: "abc",
//     },
//     {
//       value: "This is abc",
//       senderId: "123",
//       recieverId: "abc",
//     },
//   ],
// });

// con.save().then((data) => {
//   console.log("data saved");
// });
