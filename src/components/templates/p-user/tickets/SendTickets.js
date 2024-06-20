"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosSend } from "react-icons/io";
import styles from "@/styles/p-user/send-ticket.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SendTickets() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [relatedSubDepartments, setRelatedSubDepartments] = useState([]);

  //todo => Input States
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [departmentID, setDepartmentID] = useState("-1");
  const [subDepartmentID, setSubDepartmentID] = useState("-1");
  const [priority, setPriority] = useState(1);

  //todo => Error States
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [subDepartmentError, setSubDepartmentError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getDepartments = async () => {
      const res = await fetch("/api/departments");
      if (res.status === 200) {
        const data = await res.json();
        setDepartments(data);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    if (departmentID === "-1") {
      return;
    }
    const showSubDepartments = async () => {
      const res = await fetch(`/api/departments/sub/${departmentID}`);
      if (res.status === 200) {
        const data = await res.json();
        setRelatedSubDepartments(data);
      }
    };

    showSubDepartments();
  }, [departmentID]);

  function resetInputs() {
    setTitle("");
    setBody("");
    setDepartmentID("");
    setSubDepartmentID("");
    setPriority("");
  }

  function validateInputs() {
    if (departmentID === "-1") {
      setDepartmentError(" * دپارتمان را انتخاب کنید");
      return;
    }

    if (relatedSubDepartments.length > 0) {
      if (subDepartmentID === "-1") {
        setSubDepartmentError(" * بخش مربوطه را وارد کنید");
        return;
      }
    }
    if (!title.trim()) {
      setTitleError(" * عنوان را وارد کنید");
      return;
    }
    if (!body.trim()) {
      setBodyError(" * متن را وارد کنید");
      return;
    }
  }

  const addTicket = async () => {
    validateInputs();

    setSubmitting(true);

    let newTicket = {};

    if (relatedSubDepartments.length > 0) {
      newTicket = {
        title,
        body,
        department: departmentID,
        subDepartment: subDepartmentID,
        priority: Number(priority),
      };
    } else {
      newTicket = {
        title,
        body,
        department: departmentID,
        priority: Number(priority),
      };
    }

    setSubmitting(false);

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });

    if (res.status === 201) {
      toast.success("تیکت با موفقیت ارسال شد");
      router.replace("/p-user/tickets");
      resetInputs();
    } else if (res.status === 401) {
      return toast.error("لطفا ابتدا وارد سایت شوید ", { id: "not-login" });
    } else if (res.status === 500) {
      return toast.error("ارتباط با سرور با مشکل مواجه شده است", { id: "error-server" });
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span>ارسال تیکت جدید</span>
        <Link href="/p-user/tickets"> همه تیکت ها</Link>
      </h1>
      <div>
        <div className={styles.content}>
          <div className={styles.group}>
            <label>دپارتمان را انتخاب کنید:</label>
            <select value={departmentID} onChange={(e) => setDepartmentID(e.target.value)}>
              <option value="-1">لطفا یک مورد را انتخاب نمایید.</option>
              {departments?.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>

            {<small className={styles.form_alert}>{departmentError} </small>}
          </div>
          <div className={styles.group}>
            <label>نوع تیکت را انتخاب کنید:</label>
            <select value={subDepartmentID} onChange={(e) => setSubDepartmentID(e.target.value)}>
              <option value="-1">لطفا یک مورد را انتخاب نمایید.</option>
              {relatedSubDepartments?.length > 0 &&
                relatedSubDepartments.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
            </select>
            {<small className={styles.form_alert}>{subDepartmentError} </small>}
          </div>
          <div className={styles.group}>
            <label>عنوان تیکت را وارد کنید:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoComplete="off"
              placeholder="عنوان..."
              type="text"
            />
            {<small className={styles.form_alert}>{titleError} </small>}
          </div>
          <div className={styles.group}>
            <label>سطح اولویت تیکت را انتخاب کنید:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>لطفا یک مورد را انتخاب نمایید.</option>
              <option value="1">کم</option>
              <option value="2">متوسط</option>
              <option value="3">بالا</option>
            </select>
          </div>
        </div>
        <div className={styles.group}>
          <label>محتوای تیکت را وارد نمایید:</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10}></textarea>
          {<small className={styles.form_alert}>{bodyError} </small>}
        </div>
        <div className={styles.uploader}>
          <span>حداکثر اندازه: 6 مگابایت</span>
          <span>فرمت‌های مجاز: jpg, png.jpeg, rar, zip</span>
          <input type="file" />
        </div>

        <button onClick={addTicket} className={styles.btn}>
          <IoIosSend />
          {isSubmitting ? "در حال ارسال" : "  ارسال تیکت  "}
        </button>
      </div>
    </main>
  );
}
