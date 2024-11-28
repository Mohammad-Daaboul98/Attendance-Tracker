import { redirect, useActionData, useNavigation } from "react-router-dom";
import { StudentForm } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post("student", { ...data });

      queryClient.invalidateQueries("student");
      toast.success("تم انشاء طالب جديد", { theme: "colored" });

      return redirect("../students");
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };

const AddStudent = () => {
  const date = useActionData();
  const errorMessage = date?.response?.data?.msg;

  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  return (
    <StudentForm
      title="انشاء طالب"
      btnTitle="انشاء"
      errorMessage={errorMessage}
      isLoading={isLoading}
      defaultValue={false}
    />
  );
};

export default AddStudent;
