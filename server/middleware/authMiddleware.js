import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJwt } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("يجب تسجيل الدخول");
  try {
    const { _id, role } = verifyJwt(token);
    req.user = { _id, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("يجب تسجيل الدخول");
  }
};
