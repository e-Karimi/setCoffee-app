import connectedToDB from "@/data/db";
import SubDepartmentModel from "@/models/SubDepartment";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    connectedToDB();

    const departmentID = params.departmentID;

    if (!isValidObjectId(departmentID)) {
      return Response.json({ message: "department ID is not valid" }, { status: 422 });
    }

    const subDepartments = await SubDepartmentModel.find({ department: departmentID });

    return Response.json(subDepartments, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
