import SYNC_PAYFORT_MAJENTO, {
  SyncPayfortMajento,
} from "@/features/cart/apollo/mutations/syncPayfortMajento";
import { getClient } from "@/lib/apollo/client";
import logger from "@/lib/logger";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

function formDataToJson(formData: FormData): Record<string, string> {
  const jsonObject: Record<string, string> = {};

  formData.forEach((value, key) => {
    jsonObject[key] = value.toString();
  });

  return jsonObject;
}

function encodeFormDataToBase64(formData: FormData): string {
  // Convert form data to a JSON object
  const jsonObject = formDataToJson(formData);

  // Convert the JSON object to a JSON string
  const jsonString = JSON.stringify(jsonObject);

  // Encode the JSON string to Base64
  const base64Encoded = Buffer.from(jsonString).toString("base64");

  return base64Encoded;
}

export async function POST(req: Request) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  try {
    const client = getClient();
    const baseUrl = new URL(
      isDevelopment
        ? `${process.env.NEXT_PUBLIC_CLIENT_URL}`
        : `${process.env.NEXT_PUBLIC_PRODUCTION_URL}`
    );
    // Parse the body as URL-encoded data
    const formData = await req.formData(); // Automatically parses URL-encoded body
    // console.log("form data", formData);
    // console.log("response url", process.env.NEXT_PUBLIC_CLIENT_URL);

    // Convert the FormData to a plain object
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // call mutation
    const orderId = data.merchant_reference; // Example key for orderId
    const base64FormData = encodeFormDataToBase64(formData);
    // console.log("base64FormData:", base64FormData);

    // Decode the Base64 response if needed

    if (!base64FormData) {
      throw new Error("Response is missing or invalid.");
    }

    // Fetch the auth token
    // const cookieStore = await cookies();
    // const authToken = cookieStore.get("token")?.value;

    // if (!authToken) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    // Call the mutation
    const { data: mutationResponse } = await client
      .mutate<SyncPayfortMajento["Response"], SyncPayfortMajento["Variables"]>({
        mutation: SYNC_PAYFORT_MAJENTO,
        variables: { orderId, response: base64FormData },
        fetchPolicy: "no-cache",
      })
      .catch((err) => {
        // console.log("error in mutation");
        logger.error("Error in mutation", err);
        throw err;
      });

    // console.log("Mutation response:", mutationResponse);

    const redirectUrl = new URL(`/payment-response`, baseUrl);
    redirectUrl.searchParams.append("status", data.status);
    redirectUrl.searchParams.append("response_message", data.response_message);
    redirectUrl.searchParams.append(
      "merchant_reference",
      data.merchant_reference
    );
    // Object.entries(data).forEach(([key, value]) => {
    //   if (
    //     key === "status" ||
    //     key === "response_message" ||
    //     key === "merchant_reference" ||
    //     key === "amount"
    //   )
    //     redirectUrl.searchParams.append(key, value);
    // });

    // console.log("redirect url", redirectUrl);

    // Redirect to the frontend route
    // redirect(redirectUrl.toString());

    return NextResponse.redirect(redirectUrl.toString(), {
      status: 303,
      nextConfig: { basePath: baseUrl.toString(),  },
    });
  } catch (err) {
    logger.error("Error in POST handler:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
