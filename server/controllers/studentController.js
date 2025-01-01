import Student from "../models/Student.js";
import { StatusCodes } from "http-status-codes";
import qrCodeGenerator from "../utils/qrCodeGenerator.js";
import cloudinary from "cloudinary";
import dayjs from "dayjs";

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
  const studentsData = req.body; // Array of students

  // Insert multiple students
  const students = await Student.insertMany(studentsData);

  // Iterate through each student to generate QR codes
  const updatedStudents = await Promise.all(
    students.map(async (student) => {
      const qrCodeInfo = {
        id: student._id,
        studentName: student.studentName,
        teacherName: student.teacherName,
        studentClassTime: student.studentClassTime,
      };

      const response = await qrCodeGenerator(qrCodeInfo, student.studentName);

      // Update the student with the QR code information
      return await Student.findByIdAndUpdate(
        student._id,
        {
          qrCode: response.secure_url,
          qrCodePublicId: response.public_id,
        },
        { new: true }
      );
    })
  );

  res.status(StatusCodes.CREATED).json({ students: updatedStudents });
};

// export const createStudentProfile = async (req, res) => {
//   const { studentName, teacherName, studentClassTime } = req.body;

//   const student = await Student.create(req.body);

//   const qrCodeInfo = {
//     id: student._id,
//     studentName,
//     teacherName,
//     studentClassTime,
//   };

//   const response = await qrCodeGenerator(qrCodeInfo, studentName);
//   student.qrCode = response.secure_url;
//   student.qrCodePublicId = response.public_id;
//   await student.save();

//   res.status(StatusCodes.CREATED).json({ student });
// };

export const updateMultipleStudentsAttendance = async (req, res) => {
  const { date, attendance } = req.body;

  try {
    const formattedDate = dayjs(date).toISOString();

    // Separate existing and new attendance records
    const existingAttendanceOperations = [];
    const newAttendanceOperations = [];

    for (const { studentId, status } of attendance) {
      // Check if the document has an existing attendance entry for the date
      const student = await Student.findOne({
        _id: studentId,
        "studentAttendance.date": formattedDate,
      });

      if (student) {
        // Add operation to update the existing attendance
        existingAttendanceOperations.push({
          updateOne: {
            filter: {
              _id: studentId,
              "studentAttendance.date": formattedDate,
            },
            update: {
              $set: { "studentAttendance.$.status": status },
            },
          },
        });
      } else {
        // Add operation to insert new attendance
        newAttendanceOperations.push({
          updateOne: {
            filter: { _id: studentId },
            update: {
              $push: { studentAttendance: { date: formattedDate, status } },
            },
          },
        });
      }
    }

    

    // Execute bulk operations sequentially
    if (existingAttendanceOperations.length > 0) {
      await Student.bulkWrite(existingAttendanceOperations);
    }

    if (newAttendanceOperations.length > 0) {
      await Student.bulkWrite(newAttendanceOperations);
    }

    res.status(StatusCodes.OK).json({
      message: "تم اضافة حضور الطلاب",
    });
  } catch (error) {
    console.error("Error updating student attendance:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while updating student attendance.",
    });
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
