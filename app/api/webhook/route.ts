import connectDB from "@/lib/connectDb";
import Credential from "@/models/Credential";
import Test from "@/models/Test";
import axios from "axios"

const MOROCCO_API_URL = process.env.MOROCCO_API_URL as string;

if (!MOROCCO_API_URL) throw new Error("MOROCCO_API_URL is not defined");

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();
    console.log(body);
    await Test.create({ data: body });
    return Response.json({
      success: true,
      message: "Webhook processed successfully"
    });

//   const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

//   const retry = async <T>(
//     fn: () => Promise<T>,
//     options: { retries?: number; delay?: number; factor?: number } = {}
//   ): Promise<T> => {
//     const { retries = 1, delay = 1000, factor = 2 } = options;
//     let attempt = 0;

//     while (true) {
//       try {
//         return await fn();
//       } catch (err: any) {
//         attempt++;

//         const isApiError = err.response?.data?.error;
//         const isNetworkError = !err.response;

//         if (isApiError) {
//           console.error("API Error (no retry):", err.response.data.error);
//           throw err;
//         }

//         if (attempt > retries) {
//           console.error("Final failure after retries:", err.message);
//           throw err;
//         }

//         if (isNetworkError) {
//           const waitTime = delay * Math.pow(factor, attempt - 1);
//           console.log(`Retry ${attempt} in ${waitTime}ms →`, err.message);
//           await wait(waitTime);
//         } else {
//           throw err;
//         }
//       }
//     }
//   };

//   try {
//     await connectDB();

//     const body: {
//       locationId?: string;
//       phone?: string;
//       message?: string;
//       [key: string]: any;
//     } = await req.json();

//     const { locationId, phone, message } = body;

//     if (!locationId || !phone || !message) {
//       return Response.json(
//         { success: false, error: "Missing fields" },
//         { status: 400 }
//       );
//     }

//     await Test.create({ data: body });


//     const cred = await Credential.findOne({ locationId });

//     if (!cred) {
//       return Response.json(
//         { success: false, error: "Credentials not found" },
//         { status: 404 }
//       );
//     }

//     const payload = {
//       sub_account: cred.sub_account,
//       sub_account_pass: cred.sub_account_pass,
//       action: "send_sms",
//       message,
//       recipients: phone,
//       sender_id: cred.sender_id,
//     };

//     const sendRequest = async () => {
//       const res = await axios.post(MOROCCO_API_URL, null, {
//         params: payload,
//         timeout: 10000,
//       });

//       if (res.data.error) {
//         throw new Error(res.data.error);
//       }

//       return res.data;
//     };

//     const result = await retry(sendRequest, { retries: 1, delay: 1000 });

//     console.log(`SMS sent to ${phone} (locationId: ${locationId})`);

//     return Response.json({
//       success: true,
//       message: "Webhook processed successfully",
//       result,
//     });
//   } catch (error: any) {
//     console.error("Webhook Error:", error);
//     return Response.json(
//       { success: false, message: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const data = await Test.find();
    return Response.json({
      success: true,
      data
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const data = await Test.deleteMany();
    return Response.json({
      success: true,
      data
    });
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}