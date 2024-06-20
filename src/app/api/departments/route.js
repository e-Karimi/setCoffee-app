import DepartmentModel from "@/models/Department";
import connectedToDB from "@/data/db";
import { authAdmin } from "@/utils/serverActions";

export async function POST(req) {
  try {
    connectedToDB();

    const isAdmin = await authAdmin();
    if (!isAdmin) {
      return Response.json({ message: "You are not allowed to access this section" }, { status: 401 });
      // throw new Error("This API has been protected and ypu can NOT access this route");
    }

    const body = await req.json();

    const { name } = body;

    if (!name.trim()) {
      return Response.json({ message: "input data is empty" }, { status: 204 });
    }

    await DepartmentModel.create({ name });

    return Response.json({ message: "Department  added successfully" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    connectedToDB();

    const departments = await DepartmentModel.find({});

    return Response.json(departments, { status: 200 });
  } catch (error) {
    console.log("GET ~ error:", error);
    return Response.json({ message: error }, { status: 500 });
  }
}
