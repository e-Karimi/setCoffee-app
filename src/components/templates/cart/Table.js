"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TbShoppingCartX } from "react-icons/tb";
import styles from "./table.module.css";
import totalStyles from "./totals.module.css";
import getStateData from "@/utils/stateData";
import Select from "react-select";
import CartItem from "@/templates/cart/CartItem";
import toast from "react-hot-toast";

const stateOptions = getStateData();

export default function Table() {
  const [cart, setCart] = useState([]);
  const [code, setCode] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [city, setCity] = useState("-1");
  const [cities, setCities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [off, setOff] = useState(0);
  const [changeAddress, setChangeAddress] = useState(false);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(localCart);

    calcTotalPrice(localCart);
  }, []);

  useEffect(() => {
    setCities(selectedState?.value || []);
  }, [selectedState]);

  const calcTotalPrice = (cart) => {
    if (cart?.length) {
      let sumTotal = cart.reduce((prev, current) => prev + current.price * current.count, 0);
      setTotalPrice(sumTotal);
    } else {
      setTotalPrice(0);
    }
  };

  const updateCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const updateSelectBox = () => {
    setSelectedState(null);
    setChangeAddress(false);
    setCity("-1");
  };

  const applyDiscountCoupon = async () => {
    if (!code.trim()) {
      toast.error("لطفا کد را وارد کنید");
    }

    const res = await fetch("/api/discounts", {
      method: "PUT",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify({ code }),
    });

    if (res.status === 200) {
      const data = await res.json();
      const { discount } = data;

      const off = (totalPrice * discount.percent) / 100;
      const finalPrice = totalPrice - off;

      setTotalPrice(finalPrice);
      setOff(off);
      setCode("");

      return toast.success("کد تخفیف اعمال شد");
    } else if (res.status === 422) {
      return toast.error("کد تخفیف منقضی  شده است");
    } else if (res.status === 404) {
      return toast.error("کد تخفیف  معتبر نمی باشد");
    } else if (res.status === 500) {
      return toast.error("خطای سمت سرور !!");
    }
  };

  return (
    <>
      {" "}
      <div className={styles.tabel_container}>
        {cart.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th> جمع جزء</th>
                  <th>تعداد</th>
                  <th>قیمت</th>
                  <th>محصول</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 &&
                  cart.map((item, index) => (
                    <CartItem
                      key={index + 1}
                      item={item}
                      calcTotalPrice={calcTotalPrice}
                      cart={cart}
                      setCart={setCart}
                    />
                  ))}
              </tbody>
            </table>
            <section>
              <button onClick={updateCart} className={styles.update_btn}>
                {" "}
                بروزرسانی سبد خرید
              </button>
              <div>
                <button onClick={applyDiscountCoupon} className={styles.set_off_btn}>
                  اعمال کوپن
                </button>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  type="text"
                  placeholder="کد تخفیف"
                />
              </div>
            </section>
          </>
        ) : (
          <>
            <div className={styles.cart_empty} data-aos="fade-up">
              <TbShoppingCartX />
              <p>سبد خرید شما در حال حاضر خالی است. </p>
              <span>قبل از تسویه حساب، باید چند محصول را به سبد خرید خود اضافه کنید.</span>
              <span>در صفحه "فروشگاه"، محصولات جالب زیادی خواهید یافت.</span>
              <div>
                <Link href="/category">بازگشت به فروشگاه</Link>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={totalStyles.totals}>
        <p className={totalStyles.totals_title}>جمع کل سبد خرید</p>

        <div className={totalStyles.subtotal}>
          <p>جمع جزء </p>
          <p>{totalPrice.toLocaleString()} تومان</p>
        </div>
        <div className={totalStyles.subtotal} style={{ color: "#008979" }}>
          <p>مبلغ تخفیف </p>
          <p>{off.toLocaleString()} تومان</p>
        </div>
        <p className={totalStyles.motor}>
          {" "}
          پیک موتوری: <strong> 100,000 </strong>
        </p>
        <div className={totalStyles.address}>
          <p>حمل و نقل </p>
          <span>حمل و نقل به تهران (فقط شهر تهران).</span>
        </div>
        <p onClick={() => setChangeAddress((prev) => !prev)} className={totalStyles.change_address}>
          تغییر آدرس
        </p>
        {changeAddress && (
          <div className={totalStyles.address_details}>
            <Select
              defaultValue={selectedState}
              onChange={setSelectedState}
              isClearable={true}
              placeholder={"استان"}
              isRtl={true}
              isSearchable={true}
              options={stateOptions}
            />
            <div>
              <select
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={styles.select_city}
              >
                <option value="-1"> یک شهر را انتخاب کنید</option>
                {cities.length > 0 &&
                  cities?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
            <input type="number" placeholder="کد پستی" />
            <button onClick={updateSelectBox}>بروزرسانی</button>
          </div>
        )}

        <div className={totalStyles.total}>
          <p>مجموع</p>
          <p>{totalPrice.toLocaleString()} تومان</p>
        </div>
        <Link href={"/checkout"}>
          <button className={totalStyles.checkout_btn}>ادامه جهت تسویه حساب</button>
        </Link>
      </div>
    </>
  );
}
