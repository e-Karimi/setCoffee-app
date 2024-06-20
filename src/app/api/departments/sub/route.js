import SubDepartmentModel from "@/models/SubDepartment";
import connectedToDB from "@/data/db";
import { authUser } from "@/utils/serverActions";

export async function POST(req) {
  try {
    connectedToDB();

    const user = await authUser();

    if (!user) {
      return Response.json({ message: "You are not login" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return Response.json({ message: "You are not allowed to access this section" }, { status: 401 });
    }

    const body = await req.json();

    const { name, department } = body;

    if (!name.trim() || !department.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    await SubDepartmentModel.create({ name, department });

    return Response.json({ message: "SubDepartment  added successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    connectedToDB();

    const subDepartments = await SubDepartmentModel.find({});

    return Response.json(subDepartments, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
