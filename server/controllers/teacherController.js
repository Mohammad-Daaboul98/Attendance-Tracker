import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { StatusCodes } from "http-status-codes";

export const getAllTeachers = async (req, res) => {
  const { search } = req.query;

  const queryObject = {};

  if (search) {
    const searchNumeric = parseInt(search, 10);
    const isNumeric = !isNaN(searchNumeric);

    queryObject.$or = [
      { teacherName: { $regex: search, $options: "i" } },
      ...(isNumeric ? [{ age: searchNumeric }] : []),
    ];
  }

  const teachers = await Teacher.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "teacherName",
        foreignField: "teacherName",
        as: "students",
      },
    },
    {
      $addFields: {
        studentCount: { $size: "$students" },
      },
    },
    {
      $project: {
        students: 0,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({ teachers });
};

export const getTeacher = async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);
  res.status(StatusCodes.OK).json({ teacher });
};

export const createTeacherProfile = async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.status(StatusCodes.CREATED).json({ teacher });
};
export const updateTeacherProfile = async (req, res) => {
  const { id } = req.params;

  const { teacherName } = req.body;

  const teacher = await Teacher.findByIdAndUpdate(id, req.body);

  await Student.updateMany(
    { teacherName: teacher.teacherName },
    { teacherName: teacherName }
  );

  console.log(s);

  res.status(StatusCodes.OK).json({ msg: "تم تعديل حساب الاستاذ" });
};

export const deleteTeacherProfile = async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findByIdAndDelete(id);

  await Student.updateMany(
    { teacherName: teacher.teacherName },
    { teacherName: "بدون استاذ" }
  );

  res.status(StatusCodes.OK).json({
    msg: "تم حذف الاستاذ",
  });
};
