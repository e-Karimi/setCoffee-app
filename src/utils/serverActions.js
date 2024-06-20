"use server";

import UserModel from "@/models/User";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import connectedToDB from "@/data/db";
import { roles } from "./constants";

//todo => determine whether user is logged or not
export const authUser = async () => {
  connectedToDB();
  const token = cookies().get("token")?.value;
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload?.email });
    }
  }

  return user;
};

//todo => determine whether loggined user  is ADMIN or not
export const authAdmin = async () => {
  connectedToDB();
  const token = cookies().get("token")?.value;
  let user = null;

  if (token) {
    const tokenPayload = verifyAccessToken(token);
    if (tokenPayload) {
      user = await UserModel.findOne({ email: tokenPayload?.email });
      if (user.role === roles.ADMIN) {
        return user;
      }
    }
  }

  return null;

};
