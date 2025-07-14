import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { token, orderId, currency } = data;
    const merchantReference = `${orderId}`;

    const response = await axios.post(
      "https://sbpaymentservices.payfort.com/FortAPI/paymentApi",
      {
        service_command: "TOKENIZATION",
        access_code: process.env.MERCHANT_ACCESS_CODE || "LQei4lsYzT0XFf1se71n",
        merchant_identifier: process.env.YOUR_MERCHANT_IDENTIFIER || "rxCTynPU",
        token_name: token.paymentData,
        currency: currency || "AED",
        language: "en",
        command: "PURCHASE",
        amount: 1000, // Amount in minor units (e.g., 10.00 = 1000)
        merchant_reference: merchantReference,
      }
    );

    NextResponse.json(response.data);
  } catch (error) {
    console.error("Payment processing error:", error);
    NextResponse.json({ error: "Failed to process payment" });
  }
}
