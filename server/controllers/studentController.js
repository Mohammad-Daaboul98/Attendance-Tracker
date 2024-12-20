import Student from "../models/Student.js";
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
    const bulkOperations = attendance.map(({ studentId, status }) => ({
      updateOne: {
        filter: {
          _id: studentId,
          "studentAttendance.date": new Date(date),
        },
        update: {
          $set: { "studentAttendance.$.status": status },
        },
        upsert: false,
      },
    }));

    const bulkNewAttendance = attendance.map(({ studentId, status }) => ({
      updateOne: {
        filter: { _id: studentId },
        update: {
          $push: { studentAttendance: { date: new Date(date), status } },
        },
        upsert: true,
      },
    }));

    await Student.bulkWrite([...bulkOperations, ...bulkNewAttendance]);

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
