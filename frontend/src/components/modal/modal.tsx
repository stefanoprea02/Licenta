import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "./modal.module.scss";

import iconClose from "../../assets/icons/icons-close.svg";
import Image from "../image/image";

import clsx from "clsx";

export interface ModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  children?: Array<JSX.Element> | JSX.Element | ReactNode;
  leftSlotTop?: Array<JSX.Element> | JSX.Element | ReactNode;
  className?: string;
}

export default function Modal({
  show,
  setShow,
  children,
  leftSlotTop,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return show
    ? createPortal(
        <div
          ref={modalRef}
          onClick={() => setShow(false)}
          className={styles.modalOutside}
        >
          <div
            className={`${styles.modal} ${clsx(className)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalTop}>
              <div className={styles.modalLeftSlot}>{leftSlotTop}</div>
              <Image
                className={styles.modalExit}
                src={iconClose}
                imageWidth="30px"
                imageHeigth="30px"
                onClick={() => setShow(false)}
              />
            </div>
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
}
