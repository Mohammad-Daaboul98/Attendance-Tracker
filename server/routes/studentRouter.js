import { Router } from "express";
import {
  createStudentProfile,
  deleteStudentProfile,
  getAllStudents,
  getStudent,
  updateMultipleStudentsAttendance,
  updateStudentProfile,
} from "../controllers/studentController.js";


const router = Router();

router
  .route("/")
  .get(getAllStudents)
  .post(createStudentProfile)
  .patch(updateMultipleStudentsAttendance);

router
  .route("/:id")
  .get(getStudent)
  .patch(updateStudentProfile)
  .delete(deleteStudentProfile);

export default router;
