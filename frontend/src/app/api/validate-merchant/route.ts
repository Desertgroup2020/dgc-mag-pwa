import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { validationURL } = data;

    const response = await axios.post(
      "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_PAYFORT_ACCESS_TOKEN`,
        },
        params: {
          validationURL,
        },
      }
    );

    NextResponse.json(response.data);
  } catch (error) {
    console.error("Merchant validation error:", error);
    NextResponse.json({ error: "Failed to validate merchant" });
  }
}
