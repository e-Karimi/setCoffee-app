import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

//todo =>  password
export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
  const isValidPassword = await compare(password, hashedPassword);
  return isValidPassword;
};

//todo =>  token
export const generateAccessToken = (data) => {
  const token = sign({ ...data }, process.env.ACCESS_TOKEN_PRIVATEKEY, { expiresIn: "10 days" });
  return token;
};

export const verifyAccessToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.ACCESS_TOKEN_PRIVATEKEY);
    return tokenPayload;
  } catch (err) {
    console.log("verifyAccessToken ~ err:", err);
    return false;
  }
};

export const generateRfereshToken = (data) => {
  const token = sign({ ...data }, process.env.REFRESH_TOKEN_PRIVATEKEY, { expiresIn: "90 days" });
  return token;
};

export const verifyRfereshToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.REFRESH_TOKEN_PRIVATEKEY);
    return tokenPayload;
  } catch (err) {
    console.log("verifyRfereshToken ~ err:", err);
    return false;
  }
};

//todo => Validations
export const phonePattern = /09(1[0-9]|2[012]|3[5-9]|9[0])-?(\d{3}\-\d{4}|\d{7})/;
export const emailPattern = /[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/g;
export const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g;

export const validatePhone = (phone) => {
  return phonePattern.test(phone);
};

export const validateEmail = (email) => {
  return emailPattern.test(email);
};

export const validatePassword = (password) => {
  return passwordPattern.test(password);
};
