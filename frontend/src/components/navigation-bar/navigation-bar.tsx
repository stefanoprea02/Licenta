import { NavLink } from "react-router-dom";

import { useState } from "react";
import ModalAuth from "../modal-auth/modal-auth";
import styles from "./navigation-bar.module.scss";

export default function NavigationBar() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  return (
    <>
      <header>
        <nav className={styles.navbar}>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <NavLink to="/" className={styles.home}>
                Home
              </NavLink>
            </li>
            <div className={styles.listRightSide}>
              <li>
                <NavLink to="/upload/1" className={styles.home}>
                  Upload game
                </NavLink>
              </li>
              <li>
                <p onClick={() => setShowAuthModal(true)}>Sign in</p>
              </li>
            </div>
          </ul>
        </nav>
      </header>
      <ModalAuth show={showAuthModal} setShow={setShowAuthModal}></ModalAuth>
    </>
  );
}
