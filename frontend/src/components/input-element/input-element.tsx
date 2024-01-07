import cx from "classnames";
import styles from "./input-element.module.scss";

interface InputElementProps {
  name: string;
  value: string;
  validationMessage?: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  verifyAndUpdateState: (name: string, value: string) => void;
  type?: string;
}

export default function InputElement({
  name,
  value,
  validationMessage,
  handleInputChange,
  verifyAndUpdateState,
  type
}: InputElementProps) {
  return (
    <>
      <input
        value={value}
        type={type || "text"}
        name={name}
        onChange={(event) => handleInputChange(event)}
        onBlur={(event) =>
          verifyAndUpdateState(event.target.name, event.target.value)
        }
        className={cx(styles.input)}
        placeholder={name}
      />
      <span
        className={validationMessage ? styles.badInput : styles.goodInput}
      />
      {validationMessage && (
        <p className={styles.errorMessage}>{validationMessage}</p>
      )}
    </>
  );
}
