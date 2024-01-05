import { RequestHandler } from "express";
import { validationResult } from "express-validator";

const validator: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ errors: errors.array() });
};

export { validator };
