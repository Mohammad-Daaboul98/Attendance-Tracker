import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { SearchComponent, TableComponent } from "../components";
import customFetch from "../utils/customFetch";
import ExportExcel from "../components/ExportCSV";

const allStudentsQuery = (params) => {
  const { search } = params;
  return {
    queryKey: ["student", search],
    queryFn: async () => {
      const { data } = await customFetch.get("/student", {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    try {
      await queryClient.ensureQueryData(allStudentsQuery(params));
      return { searchValue: { ...params } };
    } catch (error) {
      const errorMessage = error?.response?.data?.msg;
      toast.error(errorMessage);
      throw error;
    }
  };

const AllStudents = () => {
  const { searchValue } = useLoaderData();

  const {
    data: { student },
  } = useQuery(allStudentsQuery(searchValue));

  const columns = [
    { id: "studentName", header: "الطالب", accessorKey: "studentName" },
    {
      id: "teacherName",
      header: "الاستاذ",
      accessorKey: "teacherName",
    },
    {
      id: "studentClassTime",
      header: "وقت حضور الطالب",
      accessorKey: "studentClassTime",
    },
    {
      id: "studentPhone",
      header: "رقم الهاتف",
      accessorKey: "studentPhone",
      cell: ({ cell }) => (
        <div style={{ direction: "ltr" }}>{cell.getValue()}</div>
      ),
    },
  ];

  return (
    <>
      <SearchComponent
        searchValue={searchValue}
        labelText="بحث عن طريق اسم الطالب"
      />

      <>
        <TableComponent
          title="معلومات الطالب"
          columns={columns}
          data={student}
          editAndDelete={true}
          editPage="edit-student"
          deletePage="delete-student"
          downloadBtn={true}
        />
      </>
    </>
  );
};

export default AllStudents;
