import mongoose from "mongoose";

const TeacherProfile = new mongoose.Schema({
  teacherName: String,
});

export default mongoose.model("teachers", TeacherProfile);
