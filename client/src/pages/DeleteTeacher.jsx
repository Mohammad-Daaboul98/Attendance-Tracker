import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { redirect } from "react-router-dom";

export const action =
  (queryClient) =>
  async ({ params }) => {
    try {
      await customFetch.delete(`/teacher/${params.id}`);
      queryClient.invalidateQueries(["teachers"]);
      toast.success("تم حذف الاستاذ واضافة");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    return redirect("../teachers");
  };
