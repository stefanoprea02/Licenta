import React from "react";
import Select from "react-select";
import { FormFieldSelectOption } from "../../types/types";
import styles from "./select-form.module.scss";

interface SelectProps {
  name: string;
  selectOptions: FormFieldSelectOption[];
  handleInputChange: (fieldName: string, values: string | string[]) => void;
  handleInputBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  validationMessage?: string;
  defaultValue: FormFieldSelectOption[] | undefined;
}

export default function SelectForm({
  name,
  selectOptions,
  handleInputChange,
  handleInputBlur,
  validationMessage,
  defaultValue
}: SelectProps) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <Select
        defaultValue={defaultValue}
        placeholder={name}
        isMulti
        options={selectOptions.map((option) => {
          return {
            value: option.value,
            label: option.label
          };
        })}
        onChange={(selectedOptions) =>
          handleInputChange(
            name,
            selectedOptions.map((option) => option.value)
          )
        }
        onBlur={handleInputBlur}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            "&:hover": {
              borderColor: "none"
            },
            borderColor: state.isFocused
              ? !validationMessage
                ? "#7ed56f"
                : "#ff7730"
              : "#eee",
            boxShadow: "none",
            height: "48px",
            borderRadius: "2px"
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: "#999",
            fontSize: "14px",
            fontWeight: 600
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: "8px 18px",
            backgroundColor: "#f9f9f9",
            height: "100%"
          }),
          indicatorsContainer: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: "#f9f9f9"
          }),
          dropdownIndicator: (baseStyles) => ({
            ...baseStyles,
            color: "#999"
          }),
          clearIndicator: (baseStyles) => ({
            ...baseStyles,
            color: "#999"
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            color: "black"
          })
        }}
      />
      {validationMessage && (
        <p className={styles.errorMessage}>{validationMessage}</p>
      )}
    </div>
  );
}
