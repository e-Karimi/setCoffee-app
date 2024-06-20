import connectedToDB from "@/data/db";
import OtpModel from "@/models/Otp";
import UserModel from "@/models/User";
import BanModel from "@/models/Ban";
const request = require("request");

export async function POST(req) {
  try {
    connectedToDB();

    const body = await req.json();

    const { phone, times, isSignIn } = body;

    const currentTime = new Date().getTime();
    const expTime = currentTime + 300000; //5 minutes

    const code = Math.floor(Math.random() * 99999);

    //*Whether user is banned or not
    const isUserBanned = await BanModel.findOne({ phone });
    if (isUserBanned) {
      return Response.json({ message: "this phone  has been already banned" }, { status: 403 });
    }

    //*Check Whether user is already existed or not (in signup procecess => isSignIn=false )
    const user = await UserModel.findOne({ phone });
    if (user && !isSignIn) {
      return Response.json({ message: "this account already exists " }, { status: 409 });
    }

    //*Whether Too Many Requests have been occured or not
    if (times > 3) {
      return Response.json({ message: " Too Many Requests!!" }, { status: 429 });
    }

    //*Send sms and create user in USerModel (SignUp)
    request.post(
      {
        url: "http://ippanel.com/api/select",
        body: {
          op: "pattern",
          user: "09921558293",
          pass: "sabzlearn1212",
          fromNum: "3000505",
          toNum: phone,
          patternCode: "jqcrkffb9sevvss", // YOUR_PATTERN_ID
          inputData: [{ "verification-code": code }],
        },
        json: true,
      },
      async function (error, response, body) {
        if (!error && response.statusCode === 200) {
          // console.log("response.body=>", response.body);
          await OtpModel.create({ code, phone, expTime, times });
        } else {
          return Response.json({ message: "request was failed" }, { status: 400 });
        }
      }
    );

    return Response.json({ message: "Code sent successfully :))" }, { status: 201 });
  } catch (error) {
    console.log("POST ~ error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
