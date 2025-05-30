import { Badge, Box, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelectStyles } from "../theme/components/selectStyle";

const animatedComponents = makeAnimated();

const FormRowSelect = ({
  name,
  labelText,
  list = [],
  listItem,
  onChange,
  placeholder = "اختر الخيار",
  PlacementTop,
  value,
  defaultValue,
  teacher,
  secondaryListItem,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value || null);
  const customStyles = useSelectStyles();

  const CustomOption = ({ label, studentCount }) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Text fontWeight="bold" color="white">
        {label}
      </Text>
      <Badge colorScheme={"blue"} borderRadius="full" px="2">
        {studentCount} طلاب
      </Badge>
    </Box>
  );

  useEffect(() => {
    const formattedOptions = list.map((item) => ({
      value: item[listItem] || item._id || item.id || item,
      label: secondaryListItem ? (
        <CustomOption
          label={item[listItem]}
          studentCount={item[secondaryListItem]}
        />
      ) : listItem ? (
        item[listItem]
      ) : (
        item
      ),
    }));
    setOptions(formattedOptions);
  }, [list, listItem]);

  const handleChange = (e) => {
    const selected = e.value;

    setSelectedValue(e);
    onChange && onChange(selected ? selected : null);
  };

  console.log(options);

  return (
    <FormControl isRequired={true}>
      <FormLabel htmlFor={name} mb={2} fontWeight="bold">
        {labelText || name}
      </FormLabel>
      <Box display="flex" flexDirection={"column"} gap={0}>
        <Select
          menuPlacement={PlacementTop ? "top" : "bottom"}
          styles={customStyles}
          components={animatedComponents}
          isMulti={false}
          name={name}
          id={name}
          onChange={(e) => handleChange(e)}
          placeholder={placeholder}
          options={options}
          value={
            selectedValue
              ? selectedValue
              : defaultValue && { label: defaultValue, value: defaultValue }
          }
          menuPortalTarget={document.body}
          required={true}
        />
      </Box>
    </FormControl>
  );
};

export default FormRowSelect;
