import Student from "../models/StudentProfile.js";
import { StatusCodes } from "http-status-codes";
import qrCodeGenerator from "../utils/qrCodeGenerator.js";
import cloudinary from "cloudinary";

export const getAllStudents = async (req, res) => {
  const { search } = req.query;

  const queryObject =
    req.user.role === "teacher"
      ? {
          teacherId: req.user._id,
        }
      : {};

  if (search) {
    const searchNumeric = parseInt(search, 10);
    const isNumeric = !isNaN(searchNumeric);

    queryObject.$or = [
      { studentName: { $regex: search, $options: "i" } },
      ...(isNumeric ? [{ age: searchNumeric }] : []),
    ];
  }

  const student = await Student.find(queryObject);
  res.status(StatusCodes.OK).json({ student });
};

export const getStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);
  res.status(StatusCodes.OK).json({ student });
};

export const createStudentProfile = async (req, res) => {
  const { studentName, teacherName, studentClassTime } = req.body;
  const qrCodeInfo = studentName + "-" + teacherName + "-" + studentClassTime;

  await qrCodeGenerator(qrCodeInfo, req.body);

  const student = await Student.create(req.body);

  res.status(StatusCodes.CREATED).json({ student });
};

export const updateMultipleStudentsAttendance = async (req, res) => {
  const { date, attendance } = req.body;

  try {
    await Promise.all(
      attendance.map(async ({ studentId, status }) => {
        const student = await Student.findById(studentId);

        const existingAttendance = student.studentAttendance.find(
          (attendance) => attendance.date.toISOString().split("T")[0] === date
        );

        if (existingAttendance) {
          existingAttendance.status = status;
        } else {
          student.studentAttendance.push({ date, status });
        }
        await student.save();
      })
    );

    res.status(StatusCodes.OK).json({ message: "تم تعديل حالة حضور الطالاب" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "يوجد خطأ في ادخال حضور الطلاب" });
  }
};

export const updateStudentProfile = async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    msg: "تم تعديل حساب الطالب",
    student,
  });
};

export const deleteStudentProfile = async (req, res) => {
  const { id } = req.params;

  const deletedStudent = await Student.findByIdAndDelete(id);
  if (deletedStudent.qrCodePublicId) {
    await cloudinary.v2.uploader.destroy(deletedStudent.qrCodePublicId);
  }

  res.status(StatusCodes.OK).json({
    msg: "تم حذف الطالب",
  });
};