import cx from "classnames";
import { useState } from "react";
import * as Yup from "yup";
import { FormField } from "../../types/types";
import styles from "./form.module.scss";
import SelectForm from "./select-form/select-form";

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
      message?: string;
    };
  }>(
    fields
      .map((field) => ({ [field.name]: { valid: false } }))
      .reduce((acc, obj) => Object.assign(acc, obj), {})
  );

  const [formDataText, setFormDataText] = useState<{
    [key: string]: string | string[];
  }>({});

  const [formDataImages, setFormDataImages] = useState<EventTarget[]>([]);

  //compares an input field with the yup validator
  const verifyField = (
    fieldName: string,
    value: string | string[] | EventTarget[]
  ) => {
    try {
      yup.validateSyncAt(fieldName, { [fieldName]: value });
      return { valid: true };
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      return { valid: false, message: message };
    }
  };

  //if there are no values passed it means the function just checks input validity
  const handleInputChange = (fieldName: string, value?: string | string[]) => {
    if (value) setFormDataText((prev) => ({ ...prev, [fieldName]: value }));

    const response = verifyField(fieldName, value || formDataText[fieldName]);
    setValid((prev) => ({ ...prev, [fieldName]: response }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataImages((prev) => [...prev, event.target]);

    const response = verifyField("images", [...formDataImages, event.target]);
    setValid((prev) => ({ ...prev, images: response }));
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
            {field.type === "image" && (
              <input
                type="file"
                name="images"
                onChange={(event) => handleImageChange(event)}
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
