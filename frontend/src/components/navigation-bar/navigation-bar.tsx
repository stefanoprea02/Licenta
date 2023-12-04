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
            <li>
              <NavLink to="/upload" className={styles.home}>
                Upload game
              </NavLink>
            </li>
            <li>
              <button onClick={() => setShowAuthModal(true)}>Sign in</button>
            </li>
          </ul>
        </nav>
      </header>
      <ModalAuth show={showAuthModal} setShow={setShowAuthModal}></ModalAuth>
    </>
  );
}
