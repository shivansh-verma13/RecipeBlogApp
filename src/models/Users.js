import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipes" }],
});

export const UserModel = mongoose.model("users", UserSchema);
