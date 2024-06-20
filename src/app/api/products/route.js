import connectedToDB from "@/data/db";
import ProductModel from "@/models/Product";
import fs from "fs";
import path from "path";

//todo=> create a product
export async function POST(req) {
  try {
    connectedToDB();

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

    if (isNaN(price) || isNaN(stock) || isNaN(weight)) {
      return Response.json({ message: "please enter number" }, { status: 422 });
    }

    //*Wheter any image uploaded or not
    const isUploadedImgage = typeof img === "object";

    let imgName = "";
    if (isUploadedImgage) {
      const buffer = Buffer.from(await img.arrayBuffer());
      imgName = Date.now() + img.name;
      const uploadsPath = path.join(process.cwd(), "public/uploads/" + imgName);

      //*save img in the Folder "uploads"
      fs.writeFileSync(uploadsPath, buffer);
    }

    const product = await ProductModel.create({
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
    });

    return Response.json({ message: "product created successfully", data: product }, { status: 201 });
  } catch (error) {
    console.log("products => POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

//todo=> Get all products
export async function GET(req) {
  try {
    connectedToDB();

    const products = await ProductModel.find({}, "-__v").populate("comments").lean();

    return Response.json({ data: products }, { status: 200 });
  } catch (error) {
    console.log("products => GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
