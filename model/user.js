import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  about: String,
  contact: Array,
  number: { type: String, unique: true },
  profilePic: String,
  encryptedPassword: String,
});

export const User = mongoose.model("User", UserSchema);
