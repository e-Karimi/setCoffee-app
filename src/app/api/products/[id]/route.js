import connectedToDB from "@/data/db";
import ProductModel from "@/models/Product";
import { authAdmin } from "@/utils/serverActions";
import { isValidObjectId } from "mongoose";
import fs from "fs";
import path from "path";

//todo=> Get a product
export async function GET(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const productId = params.id;

    const product = await ProductModel.findOne({ _id: productId }, "-__v");
    console.log(" product:", product);

    return Response.json({ product }, { status: 200 });
  } catch (error) {
    console.log("Get a product => GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

//todo=> Edit a product
export async function PUT(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const productID = params.id;

    if (!isValidObjectId(productID)) {
      return Response.json({ message: "Product ID is not valid" }, { status: 422 });
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const shortDescription = formData.get("shortDescription");
    const longDescription = formData.get("longDescription");
    const weight = formData.get("weight");
    const stock = formData.get("stock");
    const smell = formData.get("smell");
    const suitableFor = formData.get("suitableFor");
    const tags = formData.get("tags");
    const img = formData.get("img");

    if (isNaN(weight) || isNaN(price) || isNaN(stock)) {
      return Response.json({ message: "weight & price must be a number" }, { status: 422 });
    }

    const isUploadedImgage = typeof img === "object";

    let imgName = "";

    if (isUploadedImgage) {
      const buffer = Buffer.from(await img.arrayBuffer());
      imgName = Date.now() + img.name;
      const uploadsPath = path.join(process.cwd(), "public/uploads/" + imgName);
      //*save img in the Folder "uploads"
      fs.writeFileSync(uploadsPath, buffer);
    }

    await ProductModel.findOneAndUpdate(
      { _id: productID },
      {
        name,
        price,
        shortDescription,
        longDescription,
        weight,
        smell,
        suitableFor,
        stock,
        tags,
        img: isUploadedImgage ? `http://localhost:3000/uploads/${imgName}` : img,
      }
    );

    return Response.json({ message: "product updated successfully" }, { status: 200 });
  } catch (error) {
    console.log("product => GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

//todo => deleting a product
export async function DELETE(req, { params }) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const productId = params.id;

    if (!isValidObjectId(productId)) {
      return Response.json({ message: "Product ID is not valid" }, { status: 422 });
    }

    const deletedProduct = await ProductModel.findOneAndDelete({ _id: productId });

    if (!deletedProduct) {
      return Response.json({ message: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("DELETE ~ error:", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
