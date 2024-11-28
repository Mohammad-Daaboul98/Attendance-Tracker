import { CLASS_TIME } from "../../../server/shared/constants";

export const studentInput = [
  {
    type: "text",
    id: "studentName",
    labelText: "اسم الطالب",
    defaultKey: "studentName",
  },
  {
    type: "text",
    id: "teacherName",
    labelText: "اسم الاستاذ",
    defaultKey: "teacherName",
  },

  {
    type: "select",
    id: "studentClassTime",
    labelText: "توقيت الحضور",
    list: CLASS_TIME,
    listItem: false,
    defaultValue: "لايوجد",
    defaultKey: "studentClassTime",
  },
];
