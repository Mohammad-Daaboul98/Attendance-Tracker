import mongoose from "mongoose";

const TeacherProfile = new mongoose.Schema({
  teacherName: {
    type: String,
    unique: true,
  },
});

export default mongoose.model("teachers", TeacherProfile);
