import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import PhoneInput's default styles


function FormRow({
  name,
  type,
  id,
  labelText,
  defaultValue,
  defaultKey,
  onChange,
  isRequired,
  phone,

}) {
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [phoneValue, setPhoneValue] = useState(phone? defaultValue[defaultKey]:'');


  const inputBg = useColorModeValue("#fff", "#2D3748");
  const borderColor = useColorModeValue("#cbd5e0", "#4A5568");
  const placeholderColor = useColorModeValue("black", "#E2E8F0");

  return (
    <FormControl
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      mb={5}
      isRequired={!isRequired ? false : true}
    >
      <FormLabel htmlFor={id} mb={2} fontWeight="bold">
        {labelText}
      </FormLabel>

      {phone ? (
        <PhoneInput
          containerClass="custom-phone-input"
          country={"sy"}
          value={phoneValue}
          onChange={setPhoneValue}
          inputProps={{
            name: name,
            required: isRequired,
            id: id,
          }}
          containerStyle={{
            width: "100%",
            direction: "ltr",
          }}
          inputStyle={{
            width: "100%",
            height: "var(--chakra-sizes-10)",
            borderRadius: "var(--chakra-radii-md)",
            backgroundColor: inputBg,
            borderColor: borderColor,
            paddingRight: "4rem",
            fontSize: "var(--chakra-fontSizes-md)",
            color: "inherit",
            "::placeholder": {
              color: placeholderColor,
            },
          }}
          buttonStyle={{
            borderRadius: "0 var(--chakra-radii-md) var(--chakra-radii-md) 0",
            backgroundColor: inputBg,
            border: `1px solid ${borderColor}`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dropdownStyle={{
            backgroundColor: inputBg,
            color: "inherit",
            borderRadius: "var(--chakra-radii-md)",
            border: `1px solid ${borderColor}`,
            position: "absolute",
            top: "50%",
            left: "50%",
            translate: "(-50%,-50%)",
          }}
        />
      ) : type === "password" ? (
        <InputGroup size="lg">
          <Input
            id={id}
            type={show ? "text" : "password"}
            name={name}
            placeholder={labelText}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            pl="6rem"
            backgroundColor={inputBg}
            borderColor={borderColor}
          />
          <InputRightElement
            right="unset"
            left={0}
            display="flex"
            gap="2px"
            justifyContent="flex-start"
            width={"auto"}
          >
            <Button h="100%" size="md" onClick={() => setShow(!show)}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      ) : (
        <Input
          id={id}
          type={type}
          name={name}
          placeholder={labelText}
          defaultValue={defaultKey ? defaultValue[defaultKey] : defaultValue}
          size="lg"
          textAlign="right"
          onChange={onChange}
          backgroundColor={inputBg}
          borderColor={borderColor}
          _placeholder={{
            color: placeholderColor,
          }}
        />
      )}
    </FormControl>
  );
}

export default FormRow;
