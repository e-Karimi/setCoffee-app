"use client";
import { useState } from "react";
import styles from "./topbar.module.css";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import Modal from "./Modal";

const Topbar = ({ name }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => setShowModal(false);
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.profile}>
          <div>
            <p>{name} </p>
            <span>کاربر</span>
          </div>
          <img src="/images/one.png" alt="" />
        </div>
        <section>
          <div className={styles.searchBox}>
            <input type="text" placeholder="جستجو کنید" />
            <div>
              <IoIosSearch />
            </div>
          </div>
          <div onClick={() => setShowNotifications(true)} className={styles.notification}>
            <IoIosNotifications />
            <span>2</span>
          </div>
        </section>
      </div>
      {showNotifications && (
        <div>
          <div onClick={() => setShowNotifications(false)} className={styles.notifications_overlay}></div>
          <section className={styles.notifications_box}>
            <div>
              <p
                onClick={() => {
                  setShowNotifications(false);
                  setShowModal(true);
                }}
              >
                سلام کاربر محترم
              </p>
              <button onClick={() => setShowNotifications(false)}>دیدم</button>
            </div>

            {/* if we dont have any notif we show : */}
            {/* <div>
              <span>پیفامی وجود ندارد</span>
              <IoClose onClick={() => setShowNotifications(false)}/>
            </div> */}
          </section>
        </div>
      )}
      {showModal && (
        <Modal title="از واحد پشتیبانی" hideModal={hideModal}>
          <p className={styles.modal_text}>اطلاعات براتون پیوست شد </p>
        </Modal>
      )}
    </>
  );
};

export default Topbar;
