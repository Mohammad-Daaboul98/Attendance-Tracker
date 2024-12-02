import { redirect, useActionData, useNavigation } from "react-router-dom";

import { TeacherFrom } from "../components";

import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post("teacher", { ...data });
      queryClient.invalidateQueries(["teachers"]);
      toast.success("تم انشاء استاذ جديد", { theme: "colored" });

      return redirect("../teachers");
    } catch (error) {
      console.error("Error:", error);
      return { error, data };
    }
  };

const AddTeacher = () => {
  const data = useActionData();

  const errorMessage = data?.error?.response?.data?.msg;
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const defaultValue = { ...data?.data };

  return (
    <TeacherFrom
      title="انشاء استاذ"
      btnTitle="انشاء"
      errorMessage={errorMessage}
      defaultValue={defaultValue}
      isLoading={isLoading}
    />
  );
};

export default AddTeacher;
