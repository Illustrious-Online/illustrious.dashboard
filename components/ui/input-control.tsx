"use client"

import { Field, Input } from "@chakra-ui/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import type { JSX } from "react";

interface InputControlProps {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  value?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  setFieldValue?: (field: string, value: string) => void;
  setFieldTouched?: (field: string, isTouched: boolean) => void;
  touched?: boolean;
  errors?: string;
}

export default function InputControl({
  id,
  name,
  label,
  type,
  required,
  placeholder,
  value,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  touched,
  errors,
}: InputControlProps): JSX.Element {
  return (
    <Field.Root required invalid={touched && !!errors}>
      <Field.Label htmlFor={id} fontSize="sm" fontWeight="bold">
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      {type === "phone" ? (
        <PhoneInput
          disableDropdown
          country={"us"}
          value={value}
          onChange={(value) =>
            setFieldValue
              ? setFieldValue("phone", value)
              : console.log("No setFieldValue provided")
          }
          onBlur={() =>
            setFieldTouched
              ? setFieldTouched("phone", true)
              : console.log("No setFieldValue provided")
          }
          inputProps={{
            id: id,
            name: name,
          }}
          inputStyle={{
            width: "100%",
            background: "inherit",
            borderColor:
              touched && !!errors
                ? "var(--chakra-colors-red-500)"
                : "var(--chakra-colors-brand-500)",
            margin: "unset",
            padding: "20px 10px",
          }}
          buttonStyle={{ display: "none" }}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          borderColor={touched && !!errors ? "red.700" : "brand.500"}
          focusRingColor={touched && !!errors ? "red.700" : "brand.500"}
        />
      )}
      <Field.ErrorText>{errors}</Field.ErrorText>
    </Field.Root>
  );
}
