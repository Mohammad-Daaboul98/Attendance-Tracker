import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { StudentForm } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@chakra-ui/react";

const studentsTeachersQuery = (id) => {
  return {
    queryKey: ["students", "teachers", id],
    queryFn: async () => {
      const [students, teachers] = await Promise.all([
        customFetch.get(`/student/${id}`),
        customFetch.get("/teacher"),
      ]);

      return {
        students: students.data.student,
        teachers: teachers.data.teachers,
      };
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ params }) => {
    try {
      await queryClient.ensureQueryData(studentsTeachersQuery(params.id));
      return params.id;
    } catch (error) {
      const errorMessage = error?.response?.data?.msg;
      toast.error(errorMessage);
      throw error;
    }
  };

export const action =
  (queryClient) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      const student = await customFetch.patch(`student/${params.id}`, {
        ...data,
      });
      const toastMsg = student.data.msg;
      queryClient.invalidateQueries(["student"]);
      queryClient.invalidateQueries(["teachers"]);
      toast.success(toastMsg, { theme: "colored" });
      return redirect("../students");
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };
const EditStudent = () => {
  const date = useActionData();
  const id = useLoaderData();
  const errorMessage = date?.response?.data?.msg;

  const { data: { students, teachers } = {} } = useQuery(
    studentsTeachersQuery(id)
  );

  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  return (
    <Box
      padding={{
        md: "25px 50px",
        sm: "20px",
        base: "20px 10px",
      }}
    >
      <StudentForm
        btnTitle="تعديل"
        errorMessage={errorMessage}
        defaultValue={students}
        teachers={teachers}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default EditStudent;
