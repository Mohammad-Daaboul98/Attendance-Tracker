import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { SearchComponent, TableComponent } from "../components";
import customFetch from "../utils/customFetch";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

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
      id: "age",
      header: "عمر الطالب",
      accessorKey: "age",
    },
    {
      id: "studentPhone",
      header: "رقم الهاتف",
      accessorKey: "studentPhone",
      cell: ({ cell }) => (
        <div style={{ direction: "ltr" }}>{cell.getValue()}</div>
      ),
    },
    {
      id: "studentClassTime",
      header: "وقت حضور الطالب",
      accessorKey: "studentClassTime",
    },
    {
      id: "note",
      header: "ملاحظات",
      accessorKey: "note",
    },
  ];

  return (
    <>
      {/* <SimpleGrid columns={3} spacing={10}
        p="40px 20px"
      >
        {student.map((i, index) => (
          <Card align="center" key={index}>
            <CardHeader textAlign="center">
              <Heading size="lg" fontFamily="'Reem Kufi Fun', serif" mb='10px'>
                مسجد الاحسان
              </Heading>
              <Text fontFamily='"Almarai", sans-serif' fontSize="16px" fontWeight='bold'>
                دورة اقرأ وارق
              </Text>
            </CardHeader>
            <CardBody>
              <Image src={i.qrCode} w="200px" h="200px" />
            </CardBody>
          </Card>
        ))}
      </SimpleGrid> */}
      
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
          // downloadBtn={true}
        />
      </>
    </>
  );
};

export default AllStudents;
