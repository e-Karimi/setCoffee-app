"use client";

import { useState } from "react";
import styles from "./topbar.module.css";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import Modal from "./UserEditModal";
import { useRouter } from "next/navigation";

const Topbar = ({ name }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const route = useRouter();

  const hideModal = () => setShowModal(false);

  const searchHandler = () => {
    console.log("Topbar ~ search:", search);
    if (search?.trim()) {
      route.push(`/search?q=${search}`);
    }
  };

  const searchWithEnter = async (e) => {
    if (e.keyCode === 13) {
      searchHandler();
    }
  };

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.profile}>
          <div>
            <p> {name}</p>
            <span>ادمین</span>
          </div>
          <img src="/images/one.png" alt="" />
        </div>
        <section>
          <div className={styles.searchBox}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => searchWithEnter(e)}
              type="text"
              placeholder="کاربر مورد نظر را جستجو کنید"
            />
            <div onClick={searchHandler}>
              <IoIosSearch />
            </div>
          </div>
          <div onClick={() => setShowNotifications(true)} className={styles.notification}>
            <IoIosNotifications />
            <span>0</span>
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
                سلام ادمین محترم
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
          <p className={styles.modal_text}>عالی هستی ادمین عزیز</p>
        </Modal>
      )}
    </>
  );
};

export default Topbar;
