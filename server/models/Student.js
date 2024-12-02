import mongoose from "mongoose";
import { Attendance } from "./Attendance.js";

const StudentProfile = new mongoose.Schema({
  studentName: String,
  teacherName: String,
  studentPhone: String,
  age: Number,
  note: String,
  studentAttendance: [Attendance],
  studentClassTime: String,
  qrCode: String,
  qrCodePublicId: String,
});

export default mongoose.model("students", StudentProfile);
