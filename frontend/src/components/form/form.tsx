import cx from "classnames";
import { useState } from "react";
import * as Yup from "yup";
import styles from "./form.module.scss";
import SelectForm from "./select-form/select-form";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: {
    value: string;
    label: string;
  }[];
}

interface FormProps {
  fields: FormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  yup: Yup.Schema;
}

const Form = ({ fields, onSubmit, yup }: FormProps) => {
  //for every field there will be an entry inside this state about whether the field is valid
  //and if not what the validation error is
  const [valid, setValid] = useState<{
    [key: string]: {
      valid: boolean;
      message: string;
    };
  }>(
    fields
      .map((field) => ({ [field.name]: { valid: false, message: "" } }))
      .reduce((acc, obj) => Object.assign(acc, obj), {})
  );

  const [formData, setFormData] = useState<{
    [key: string]: string | string[];
  }>({});

  const verifyField = (fieldName: string, value: string | string[]) => {
    try {
      yup.validateSyncAt(fieldName, { [fieldName]: value });
      return { valid: true, message: "" };
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      return { valid: false, message: message };
    }
  };

  const handleInputChange = (fieldName: string, value?: string | string[]) => {
    if (value) setFormData((prev) => ({ ...prev, [fieldName]: value }));

    const response = verifyField(fieldName, value || formData[fieldName]);
    setValid((prev) => ({ ...prev, [fieldName]: response }));
  };

  const formIsValid =
    valid && Object.entries(valid).every(([, value]) => value.valid);

  return (
    <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
      {fields.map((field) => {
        return (
          <div className={styles.formSection} key={field.name}>
            {(field.type === "text" || field.type === "password") && (
              <>
                <input
                  type={field.type}
                  name={field.name}
                  onChange={(event) =>
                    handleInputChange(field.name, event.target.value)
                  }
                  onBlur={() => handleInputChange(field.name)}
                  className={cx(styles.input)}
                  placeholder={field.label}
                />
                <span
                  className={
                    valid![field.name]?.valid === false
                      ? styles.badInput
                      : styles.goodInput
                  }
                />
              </>
            )}
            {field.type === "select" && (
              <SelectForm
                field={field}
                handleInputChange={handleInputChange}
                valid={valid![field.name]?.valid}
              />
            )}

            {valid![field.name]?.message && (
              <p className={styles.errorMessage}>
                {valid![field.name]?.message}
              </p>
            )}
          </div>
        );
      })}
      <button
        className={cx(styles.button, !formIsValid && styles.buttonInvalid)}
        type="submit"
        disabled={!formIsValid}
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
