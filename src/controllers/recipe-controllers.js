import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

export const getAllRecipes = async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    return res.status(200).json({ message: "OK", response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: error.message });
  }
};

export const postRecipe = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    const {
      name,
      ingredients,
      description,
      instructions,
      imageURL,
      cookingTime,
      userOwnerId,
      userOwnerName,
    } = req.body.recipe;
    const recipe = new RecipeModel({
      name,
      ingredients,
      description,
      instructions,
      imageURL,
      cookingTime,
      userOwnerId,
      userOwnerName,
    });
    // console.log(recipe);
    const response = await recipe.save();
    return res.status(200).json({ message: "OK", response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    user.savedRecipes.push(recipe);
    await user.save();
    return res.status(200).json({
      message: "Saved Recipe Successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: error.message });
  }
};

export const getSavedRecipesID = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    return res
      .status(200)
      .json({ message: "OK", savedRecipes: user.savedRecipes });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wromg", cause: error.message });
  }
};

export const getAllSavedRecipes = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    return res.status(200).json({ message: "OK", savedRecipes });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mesaage: "Something went wrong", cause: error.message });
  }
};

export const deleteSavedRecipe = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permisssion's Denied" });
    }
    const recipeIDToDelete = req.params.recipeID;
    const indexToRemove = user.savedRecipes.indexOf(recipeIDToDelete);

    if (indexToRemove !== -1) {
      user.savedRecipes.splice(indexToRemove, 1);
      await user.save();
      return res.status(200).json({
        message: "Recipe unsaved successfully",
        savedRecipes: user.savedRecipes,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Recipe not found in the saved recipes" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: err.message });
  }
};
