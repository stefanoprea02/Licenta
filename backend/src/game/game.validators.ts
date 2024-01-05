import { body } from "express-validator";

const uploadDraftValidator = [
  body("title")
    .isString()
    .isLength({ min: 2, max: 20 })
    .withMessage("Title must be between 2 and 20 characters"),
  body("description")
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("genres").isArray().withMessage("Genres must be an array of Strings"),
  body("languages")
    .isArray()
    .withMessage("Languages must be an array of Strings"),
  body("platforms")
    .isArray()
    .withMessage("Platforms must be an array of Strings"),
  body("tags").isArray().withMessage("Tags must be an array of Strings"),
];

export { uploadDraftValidator };
