import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import { config } from "dotenv";
import { userRouter } from "./routes/users.js";
import { recipeRouter } from "./routes/recipes.js";
import cookieParser from "cookie-parser";

config({
  path: path.join(process.cwd(), "..", ".env"),
});
const app = express();

app.use(cors({ origin: "http://localhost:5176", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {})
  .catch((err) => console.log(err));

app.listen(3002, () => {
  console.log("Server is Up and Running");
});

// iv02W5Nz0y4sRNbQ
// vershivu
