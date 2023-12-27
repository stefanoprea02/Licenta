import Select from "react-select";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: {
    value: string;
    label: string;
  }[];
}

interface SelectProps {
  field: FormField;
  handleInputChange: (fieldName: string, values?: string | string[]) => void;
  valid: boolean;
}

export default function SelectForm({
  field,
  handleInputChange,
  valid
}: SelectProps) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <Select
        placeholder={field.label}
        isMulti
        options={field.options?.map((option) => {
          return {
            value: option.value,
            label: option.label
          };
        })}
        onChange={(selectedOptions) =>
          handleInputChange(
            field.name,
            selectedOptions?.map((option) => option.value)
          )
        }
        onBlur={() => handleInputChange(field.name)}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            "&:hover": {
              borderColor: "none"
            },
            borderColor: state.isFocused
              ? valid
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
          })
        }}
      />
    </div>
  );
}
