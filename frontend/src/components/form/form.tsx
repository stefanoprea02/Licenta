import cx from "classnames";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import styles from "./form.module.scss";

interface FormField {
  name: string;
  label: string;
  type: string;
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
  }>();

  //this is a reference that contains an array of references to every field input
  const inputRefs = useRef<{
    [key: string]: React.RefObject<HTMLInputElement>;
  }>({});

  useEffect(() => {
    fields.forEach((field) => {
      if (inputRefs.current[field.name]?.current) {
        inputRefs.current[field.name].current!.value = "";
      } else inputRefs.current[field.name] = React.createRef();
    });

    const initialFormData: {
      [key: string]: { valid: boolean; message: string };
    } = {};
    fields.forEach((field) => {
      initialFormData[field.name] = { valid: false, message: "" };
    });
    setValid(initialFormData);
  }, [fields]);

  const verifyField = (fieldName: string) => {
    const formData: { [key: string]: string } = {};
    formData[fieldName] = inputRefs.current[fieldName]?.current?.value || "";

    try {
      yup.validateSyncAt(fieldName, formData);
      return { valid: true, message: "" };
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      return { valid: false, message: message };
    }
  };

  const handleInputChange = (fieldName: string) => {
    const response = verifyField(fieldName);

    setValid((prev) => ({ ...prev, [fieldName]: response }));
  };

  const formIsValid =
    valid && Object.entries(valid).every(([, value]) => value.valid);

  if (valid)
    return (
      <form onSubmit={(event) => onSubmit(event)} className={styles.form}>
        {fields.map((field) => {
          if (valid[field.name])
            return (
              <div className={styles.formSection} key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  onChange={() => handleInputChange(field.name)}
                  onBlur={() => handleInputChange(field.name)}
                  className={cx(styles.input)}
                  ref={inputRefs.current[field.name]}
                  placeholder={field.name}
                />
                <span
                  className={
                    valid[field.name].valid === false
                      ? styles.badInput
                      : styles.goodInput
                  }
                />
                {valid[field.name].message && (
                  <p className={styles.errorMessage}>
                    {valid[field.name].message}
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
  else return <></>;
};

export default Form;
