import cx from "classnames";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { FormField } from "../../types/types";
import styles from "./form.module.scss";
import SelectForm from "./select-form/select-form";

interface FormProps {
  fields: FormField[];
  onSubmit: (data: React.FormEvent<HTMLFormElement>) => void;
  yup: Yup.Schema;
}

const Form = ({ fields, onSubmit, yup }: FormProps) => {
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
  }>(
    fields
      .map((field) => ({ [field.name]: "" }))
      .reduce((acc, obj) => Object.assign(acc, obj), {})
  );

  const [formDataImages, setFormDataImages] = useState<File[]>([]);

  //compares an input field with the yup validator
  const verifyField = (
    fieldName: string,
    value: string | string[] | File[]
  ) => {
    try {
      yup.validateSyncAt(fieldName, { [fieldName]: value });
      return { valid: true };
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      return { valid: false, message: message };
    }
  };

  const verifyAndUpdateState = (
    fieldName: string,
    value: string | string[] | File[]
  ) => {
    const response = verifyField(fieldName, value);
    setValid((prev) => ({ ...prev, [fieldName]: response }));
  };

  const handleInputChange = (fieldName: string, value: string | string[]) => {
    setFormDataText((prev) => ({ ...prev, [fieldName]: value }));
    verifyAndUpdateState(fieldName, value);
  };

  const handleInputBlur = (fieldName: string) => {
    verifyAndUpdateState(fieldName, formDataText[fieldName]);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];

    if (file) {
      setFormDataImages((prev) => [...prev, file]);
      verifyAndUpdateState("images", [...formDataImages, file]);

      fileInput.value = "";
    }
  };

  const images = useMemo(() => {
    return formDataImages.map((formDataImage) => (
      <img
        className={styles.image}
        key={URL.createObjectURL(formDataImage)}
        src={URL.createObjectURL(formDataImage)}
      />
    ));
  }, [formDataImages]);

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
                  value={formDataText[field.name]}
                  type={field.type}
                  name={field.name}
                  onChange={(event) =>
                    handleInputChange(field.name, event.target.value)
                  }
                  onBlur={() => handleInputBlur(field.name)}
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
                handleInputBlur={handleInputBlur}
                valid={valid![field.name]?.valid}
              />
            )}
            <>
              {field.type === "image" && (
                <div className={styles.imagesContainer}>
                  {images}
                  {field.maxImages && images.length < field.maxImages && (
                    <input
                      type="file"
                      name="images"
                      className={styles.imageInput}
                      onChange={(event) => handleImageChange(event)}
                      accept="image/png, image/jpeg"
                    />
                  )}
                </div>
              )}
            </>
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
