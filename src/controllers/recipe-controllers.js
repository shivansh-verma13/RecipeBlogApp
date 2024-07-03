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

export const likeRecipe = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permission's Denied" });
    }
    const recipeToLike = await RecipeModel.findById(req.body.recipeID);
    const recipeLikesCount = await recipeToLike.likesCount;
    recipeToLike.likesCount = recipeLikesCount + 1;
    await recipeToLike.save();
    user.likedRecipes.push(recipeToLike);
    await user.save();
    return res.status(200).json({
      message: "Liked Recipe Successfully",
      likedRecipes: user.likedRecipes,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong", cause: error.message });
  }
};

export const unLikeRecipe = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Does not exists or Token malfunctioned" });
    }
    if (user._id.toString() !== res.locals.jwtData.id.toString()) {
      return res.status(401).json({ message: "Permission's Denied" });
    }
    const recipeToUnlike = await RecipeModel.findById(req.params.recipeID);
    const recipeLikesCount = await recipeToUnlike.likesCount;
    recipeToUnlike.likesCount = recipeLikesCount - 1;
    await recipeToUnlike.save();
    const indexToRemove = user.likedRecipes.indexOf(recipeToUnlike);

    if (indexToRemove !== -1) {
      user.likedRecipes.splice(indexToRemove, 1);
      await user.save();
      return res
        .status(200)
        .json({
          message: "Recipe unliked successfully",
          likedRecipes: user.likedRecipes,
        });
    } else {
      return res
        .status(404)
        .json({ message: "Recipe not found in the liked recipes" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", cause: err.message });
  }
};

export const getLikedRecipesID = async (req, res) => {
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
      .json({ message: "OK", likedRecipes: user.likedRecipes });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wromg", cause: error.message });
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
