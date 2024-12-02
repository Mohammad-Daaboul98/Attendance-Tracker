import { CLASS_TIME } from "../../../server/shared/constants";

export const teacherInput = [
  {
    type: "text",
    id: "teacherName",
    labelText: "اسم الاستاذ",
    defaultKey: "teacherName",
  },
];
export const studentInput = [
  {
    type: "text",
    id: "studentName",
    labelText: "اسم الطالب",
    defaultKey: "studentName",
    require: true,
  },

  {
    type: "number",
    id: "age",
    labelText: "عمر الطالب",
    defaultKey: "age",
    require: true,
  },
  {
    type: "select",
    id: "teacherName",
    labelText: "الاستاذ",
    defaultKey: "teacherName",
    listItem: "teacherName",
    defaultKey: "teacherName",
    secondaryListItem: "studentCount",
  },
  {
    type: "tel",
    id: "studentPhone",
    labelText: "رقم الهاتف",
    defaultKey: "studentPhone",
    phone: true,
    require: true,

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
  {
    type: "text",
    id: "note",
    labelText: "اضافة ملاحظة",
    defaultKey: "note",
    require: false,
  },
];
