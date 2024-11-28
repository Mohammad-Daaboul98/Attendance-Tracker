import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import { hashPassword } from "../utils/passwordUtils.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const createUser = async (req, res) => {
  let { userName, password } = req.body;

  const hashedPassword = await hashPassword(password);
  password = hashedPassword;

  await User.create({ userName, password });
  res.status(StatusCodes.CREATED).json({ msg: "welcome back sir" });
};
