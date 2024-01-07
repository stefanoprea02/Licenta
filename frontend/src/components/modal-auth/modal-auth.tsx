/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";

import Modal from "../modal/modal";

import styles from "./modal-auth.module.scss";

import * as Yup from "yup";

import cx from "classnames";
import useHttp from "../../hooks/use-http";
import { UserContext } from "../../store/UserContext";
import { UserDataType } from "../../types/types";
import { authValidator } from "../../types/yup-validators";
import InputElement from "../input-element/input-element";

interface ModalAuthProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function ModalAuth({ show, setShow }: ModalAuthProps) {
  const [modalType, setModalType] = useState<string>("signIn");
  const { sendRequest, error, isLoading, isFinished, resetValues } = useHttp();
  const ctx = useContext(UserContext);

  const authYup = Yup.object().shape(authValidator);

  const [valid, setValid] = useState({
    username: { valid: false, message: "" },
    email: { valid: false, message: "" },
    password: { valid: false, message: "" }
  });

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: ""
  });

  const applyData = ({ username, email, _id, token }: UserDataType) => {
    ctx.setUserData({ username, email, _id, token });
  };

  useEffect(() => {
    if (isFinished?.[modalType] && !error?.[modalType]) {
      setShow(false);
    }
  }, [isFinished, error, modalType]);

  useEffect(() => {
    if (show && (error || isLoading || isFinished)) resetValues();
  }, [show]);

  const handleSubmit = () => {
    let url = "http://localhost:3000/users/signup";
    if (modalType === "signIn") {
      url = "http://localhost:3000/users/signin";
    }

    setFormData({
      username: "",
      email: "",
      password: ""
    });

    setValid({
      username: { valid: false, message: "" },
      email: { valid: false, message: "" },
      password: { valid: false, message: "" }
    });

    sendRequest(
      {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: { data: formData, type: "Object" },
        id: modalType === "signIn" ? "signIn" : "signUp"
      },
      applyData
    );
  };

  const verifyAndUpdateState = (fieldName: string, value: string) => {
    try {
      authYup.validateSyncAt(fieldName, { [fieldName]: value });
      setValid((prev) => ({ ...prev, [fieldName]: { valid: true } }));
    } catch (err: unknown) {
      const message = err instanceof Yup.ValidationError ? err.message : "";
      setValid((prev) => ({
        ...prev,
        [fieldName]: { valid: false, message: message }
      }));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
    verifyAndUpdateState(event.target.name, event.target.value);
  };

  const formIsValid =
    (modalType === "signIn" || valid.email.valid) &&
    valid.username.valid &&
    valid.password.valid;

  return (
    <Modal
      show={show}
      setShow={setShow}
      leftSlotTop={
        <span className={styles.title}>
          {modalType === "signUp" ? "Sign up" : "Sign in"}
        </span>
      }
      className={styles.modal}
    >
      <div className={styles.modalContent}>
        <p>
          <span>
            {modalType === "signIn"
              ? "You don't have an account? Click "
              : "Do you already have an account? Click "}
          </span>
          <b
            className={styles.clickable}
            onClick={() =>
              setModalType(modalType === "signIn" ? "signUp" : "signIn")
            }
          >
            here
          </b>
          <span>
            {modalType === "signIn" ? " to sign up!" : " to sign in!"}
          </span>
        </p>

        {!isLoading?.[modalType] && error?.[modalType] && (
          <p className={styles.errorMessage}>{error[modalType].toString()}</p>
        )}

        <div style={{ marginTop: "20px" }}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
            className={styles.form}
          >
            {(modalType === "signIn"
              ? (["username", "password"] as (keyof FormData)[])
              : (["username", "email", "password"] as (keyof FormData)[])
            ).map((value) => {
              return (
                <div className={styles.formSection} key={value}>
                  <InputElement
                    name={value}
                    value={formData[value] as string}
                    handleInputChange={handleInputChange}
                    verifyAndUpdateState={verifyAndUpdateState}
                    validationMessage={valid[value].message}
                    type={value === "password" ? "password" : undefined}
                  />
                </div>
              );
            })}

            <button
              className={cx(
                styles.button,
                !formIsValid && styles.buttonInvalid
              )}
              type="submit"
              disabled={!formIsValid}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
