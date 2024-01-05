/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useMemo, useState } from "react";

import Modal from "../modal/modal";

import styles from "./modal-auth.module.scss";

import * as Yup from "yup";

import useHttp from "../../hooks/use-http";
import { UserContext } from "../../store/UserContext";
import { FormField, UserType } from "../../types/types";
import { authValidator } from "../../types/yup-validators";
import Form from "../form/form";

interface ModalAuthProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

interface ApplyDataProps {
  user: UserType;
  token: string;
}

export default function ModalAuth({ show, setShow }: ModalAuthProps) {
  const [modalType, setModalType] = useState<string>("signIn");
  const { sendRequest, error, isLoading, isFinished, resetValues } = useHttp();
  const ctx = useContext(UserContext);

  const applyData = ({ user }: ApplyDataProps) => {
    ctx.setUserData(user);
  };

  useEffect(() => {
    if (isFinished?.[modalType] && !error?.[modalType]) {
      setShow(false);
    }
  }, [isFinished, error]);

  useEffect(() => {
    if (show && (error || isLoading || isFinished)) resetValues();
  }, [show]);

  const handleSubmit = async (data: object) => {
    console.log(data);
    let url = "http://localhost:3000/users/signup";
    if (modalType === "signIn") {
      url = "http://localhost:3000/users/signin";
    }

    sendRequest(
      {
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: { data, type: "Object" },
        id: modalType === "signIn" ? "signIn" : "signUp"
      },
      applyData
    );
  };

  const authYup = Yup.object().shape(authValidator);

  const fields = useMemo(() => {
    const a: FormField[] = [
      { name: "username", label: "Username", type: "text" as const },
      { name: "email", label: "Email", type: "text" as const },
      { name: "password", label: "Password", type: "password" as const }
    ].filter((field) => modalType === "signUp" || field.name !== "email");
    return a;
  }, [modalType]);

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
          <Form
            submitType="Object"
            key={modalType}
            fields={fields}
            onSubmit={handleSubmit}
            yup={authYup}
          />
        </div>
      </div>
    </Modal>
  );
}
