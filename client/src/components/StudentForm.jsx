import { Box, Button, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { studentInput } from "../utils/formFields";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";
import { useState } from "react";
import { BeatLoader } from "react-spinners";

const StudentForm = ({
  title,
  btnTitle,
  errorMessage,
  defaultValue,
  isLoading,
}) => {
  return (
    <Box
      padding={{
        md: "25px 50px",
        sm: "20px",
        base: "20px 10px",
      }}
      m={"auto"}
      boxShadow="2xl"
      borderRadius="md"
    >
      {title && (
        <Heading mb={"50px"} textAlign="center">
          {title}
        </Heading>
      )}

      {errorMessage ? (
        <Text fontSize="md" color="tomato" py="25px">
          {errorMessage}
        </Text>
      ) : null}

      <Form method="post">
        <SimpleGrid
          columns={{ lg: 2, md: 2, sm: 2, base: 1 }}
          spacing={{ md: "10px 20px", base: "10px" }}
        >
          {studentInput.map(
            ({
              type,
              id,
              labelText,
              list,
              listItem,
              defaultKey,
              btnPassword,
              phone,
            }) => {
              if (type !== "select") {
                return (
                  <FormRow
                    key={id}
                    type={type}
                    name={id}
                    id={id}
                    labelText={labelText}
                    defaultValue={defaultValue}
                    defaultKey={defaultKey}
                    btnPassword={btnPassword}
                    phone={phone}
                    isRequired={true}
                  />
                );
              } else {
                return (
                  <FormRowSelect
                    key={id}
                    name={id}
                    labelText={labelText}
                    list={list}
                    listItem={listItem}
                    PlacementTop={true}
                    defaultValue={defaultValue[defaultKey]}
                  />
                );
              }
            }
          )}
        </SimpleGrid>
        <Button
          mt="15px"
          type="submit"
          colorScheme="teal"
          size="lg"
          width="full"
          isLoading={isLoading}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={(e) => e.preventDefault}
        >
          {btnTitle}
        </Button>
      </Form>
    </Box>
  );
};

export default StudentForm;
