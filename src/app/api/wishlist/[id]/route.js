import WishlistModel from "@/models/Wishlist";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";

export async function DELETE(req, { params }) {
  try {
    connectedToDB();

    const user = await authUser();
    if (!user) {
      return Response.json({ message: "You are not logged in" }, { status: 401 });
    }
    const productID = params.id;

    const deletedFavorit = await WishlistModel.findOneAndDelete({
      $and: [{ userID: user?._id }, { productID }],
    });

    if (!deletedFavorit) {
      return Response.json({ message: "Product Not Found in Wishlist" }, { status: 404 });
    }

    return Response.json(
      { message: "This product was deleted successfully from the Wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not logged in" }, { status: 401 });
    }

    const productID = params.id;

    const favoritProduct = await WishlistModel.findOne({ userID: user._id, productID });

    if (!favoritProduct) {
      return Response.json({ message: "product not found" }, { status: 404 });
    }
    return Response.json({ favoritProduct }, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
