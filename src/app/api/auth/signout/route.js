import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().delete("token");
    return Response.json({ message: "You logged out" }, { status: 200 });
  } catch (error) {
    console.log("❌signout ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
