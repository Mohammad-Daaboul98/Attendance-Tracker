import { Router } from "express";
import {
  createTeacherProfile,
  deleteTeacherProfile,
  getAllTeachers,
  getTeacher,
  updateTeacherProfile,
} from "../controllers/teacherController.js";
import { validateIdParam } from "../middleware/validationMiddleware.js";

const router = Router();

router.route("/").get(getAllTeachers).post(createTeacherProfile);

router
  .route("/:id")
  .get(getTeacher)
  .patch(updateTeacherProfile)
  .delete(deleteTeacherProfile);

export default router;
