import { validationResult, body } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(422).json({ errors: errors.array() });
  };
};

export const loginValidator = [
  body("userName").notEmpty().withMessage("Username is required!"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password is required!"),
];

export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required!"),
  body("tagline").notEmpty().withMessage("Tagline is required!"),
  ...loginValidator,
];

export const recipeValidator = [
  body("name").notEmpty().withMessage("Name is required!"),
  body("description").notEmpty().withMessage("Description is required!"),
  body("instructions").notEmpty().withMessage("Instructions are required!"),
  body("ingredients").notEmpty().withMessage("Ingredients is required!"),
  body("imageURL").notEmpty().withMessage("Image URL is required!"),
  body("cookingTime").notEmpty().withMessage("Cooking Time is required!"),
];
