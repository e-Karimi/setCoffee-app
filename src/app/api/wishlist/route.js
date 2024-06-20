import { isValidObjectId } from "mongoose";
import UserModel from "@/models/User";
import ProductModel from "@/models/Product";
import WishlistModel from "@/models/Wishlist";
import connectedToDB from "@/data/db";

export async function POST(req) {
  try {
    connectedToDB();
    const body = await req.json();

    const { userID, productID } = body;

    const productExists = await WishlistModel.findOne({ userID, productID });

    if (productExists) {
      return Response.json({ message: "product is already added to your Wishlist" }, { status: 409 });
    }

    if (!isValidObjectId(userID)) {
      return Response.json({ message: "userID is not valid" }, { status: 422 });
    }
    if (!isValidObjectId(productID)) {
      return Response.json({ message: "productID is not valid" }, { status: 422 });
    }
    const isUserExisted = await UserModel.findOne({ _id: userID });
    const isProductExisted = await ProductModel.findOne({ _id: productID });

    if (!isUserExisted) {
      return Response.json({ message: "user not found" }, { status: 404 });
    }
    if (!isProductExisted) {
      return Response.json({ message: "product not found" }, { status: 404 });
    }

    await WishlistModel.create({ userID, productID });
    return Response.json({ message: "This product is added to the Wishlist successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

