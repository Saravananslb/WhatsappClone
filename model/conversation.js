import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  _id: String,
  message: Array,
});

export const Conversation = mongoose.model("Conversation", ConversationSchema);
