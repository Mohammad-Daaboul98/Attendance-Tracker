import {
  HomeLayout,
  Login,
  Error,
  DashboardLayout,
  AllStudents,
  AddStudent,
  EditStudent,
  StudentsAttendance,
} from "../pages";
import { queryClient } from "../utils/queryClient";
import { action as loginAction } from "../pages/Login";

import { action as addStudentAction } from "../pages/AddStudent";
import {
  action as editStudentAction,
  loader as editStudentLoader,
} from "../pages/EditStudent";
import {
  loader as studentAttendanceLoader,
  action as studentAttendanceAction,
} from "../pages/StudentsAttendance";
import { action as deleteStudentAction } from "../pages/DeletesStudent";
import { loader as studentLoader } from "../pages/AllStudents";
import { loader as dashboardLoader } from "../pages/DashboardLayout";

export const Router = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,

    children: [
      {
        index: true,
        element: <Login />,
        action: loginAction(queryClient),
      },
      {
        path: "dashboard",
        element: <DashboardLayout queryClient={queryClient} />,
        loader: dashboardLoader(queryClient),
        children: [
          {
            path: "students",
            element: <AllStudents />,
            loader: studentLoader(queryClient),
          },
          {
            path: "students-attendance",
            element: <StudentsAttendance />,
            action: studentAttendanceAction(queryClient),
            loader: studentAttendanceLoader(queryClient),
          },
          {
            path: "add-student",
            element: <AddStudent />,
            action: addStudentAction(queryClient),
          },
          {
            path: "edit-student/:id",
            element: <EditStudent />,
            action: editStudentAction(queryClient),
            loader: editStudentLoader(queryClient),
          },
          {
            path: "delete-student/:id",
            action: deleteStudentAction(queryClient),
          },
        ],
      },
    ],
  },
];
