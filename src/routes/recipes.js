import express from "express";
import { verifyToken } from "../utils/token-manager.js";
import {
  saveRecipe,
  getAllRecipes,
  postRecipe,
  getSavedRecipesID,
  getAllSavedRecipes,
  deleteSavedRecipe,
} from "../controllers/recipe-controllers.js";
import { recipeValidator, validate } from "../utils/validators.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.post("/new-recipe", verifyToken, postRecipe);
router.put("/save-recipe", verifyToken, saveRecipe);
router.get("/saved-recipes/ids", verifyToken, getSavedRecipesID);
router.get("/saved-recipes", verifyToken, getAllSavedRecipes);
router.delete("/saved-recipes/:recipeID", verifyToken, deleteSavedRecipe);

export { router as recipeRouter };
