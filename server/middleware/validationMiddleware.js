import mongoose from "mongoose";
import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";

import { arabicNameRegex } from "../utils/nameRegex.js";
import User from "../models/User.js";

const withValidationErrors = (validationValue) => {
  return [
    validationValue,
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        const errorMessage = error.array().map((err) => err.msg);
        throw new BadRequestError(errorMessage);
      }
      next();
    },
  ];
};

export const validateUserInput = withValidationErrors([
  body("userName")
    .notEmpty()
    .withMessage("يجب ادخال اسم المستخدم")
    .custom((userName) => arabicNameRegex(userName, "اسم المستخدم")),
  body("password")
    .isLength({ min: 6 })
    .withMessage("كلمة السر يجب ان تتألف على الأقل من (8) أرقام أو أحرف")
    .notEmpty()
    .withMessage("يجب ادخال كلمة السر "),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (id, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");

    const user = await User.findById(id);
    if (!user) throw new NotFoundError(`لا يوجد مستخدم بالمعرف: ${id}`);
  }),
]);
export const validateLoginInput = withValidationErrors([
  body("userName").notEmpty().withMessage("يجب ادخال اسم المستخدم"),
  body("password").notEmpty().withMessage("يحب ادخال كلمة السر"),
]);
