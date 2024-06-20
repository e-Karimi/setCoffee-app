import DiscountModel from "@/models/Discount";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";
import { roles } from "@/utils/constants";

export async function DELETE(req, { params }) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    if (user.role !== roles.ADMIN) {
      return Response.json({ message: "You are not allowed to access this section" }, { status: 401 });
    }

    const discountID = params.id;
    
    await DiscountModel.findOneAndDelete({ _id: discountID });

    return Response.json({ message: "OFF code deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("DELETE ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
