import { generateSignature } from "@/app/actions/generateSignature";
import logger from "@/lib/logger";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  // console.log("API route handler initiated"); // <-- Ensure this runs
  const isDevelopment = process.env.NODE_ENV !== "production";
  try {
    // Your current payload preparation logic here
    const data = await req.json();

    // console.log("payment route", data);

    const { amount, currency, orderId, customer_email } = data; // Example payload fields
    const merchantReference = `${orderId}`;

    // Define your configuration
    const payfortConfig = {
      command: "PURCHASE",
      merchantIdentifier: process.env.YOUR_MERCHANT_IDENTIFIER || "rxCTynPU",
      merchantReference: merchantReference,
      accessCode: process.env.MERCHANT_ACCESS_CODE || "LQei4lsYzT0XFf1se71n",
      requestPhrase: process.env.REQ_SHA_PHRASE,
      language: "en",
      currency: currency || "AED",
      customer_email: customer_email,
      returnUrl: isDevelopment
        ? "http://localhost:3007/api/payment-response"
        : process.env.RETURN_URL
        ? process.env.RETURN_URL
        : "https://dubaigardencentre.cmxdev.com/api/payment-response",
    };

    // Create signature
    // Parameters to be signed
    const signatureParams: Record<string, string> = {
      merchant_identifier: payfortConfig.merchantIdentifier,
      access_code: payfortConfig.accessCode,
      merchant_reference: payfortConfig.merchantReference,
      language: payfortConfig.language,
      currency: payfortConfig.currency, // Ensure string
      amount: amount, // Ensure string
      customer_email: payfortConfig.customer_email,
      command: payfortConfig.command,
      return_url: payfortConfig.returnUrl,
    };

    // Generate the signature
    const signature = generateSignature(
      signatureParams,
      process.env.REQ_SHA_PHRASE!
    );

    // Prepare the payment request
    const paymentPayload = {
      merchant_identifier: payfortConfig.merchantIdentifier,
      access_code: payfortConfig.accessCode,
      merchant_reference: payfortConfig.merchantReference,
      language: payfortConfig.language,
      currency: payfortConfig.currency, // Ensure string
      amount: amount, // Ensure string
      customer_email: customer_email,
      command: payfortConfig.command,
      return_url: payfortConfig.returnUrl,
      signature,
    };

    // console.log("Generated Payload:", paymentPayload);
    // console.log("isDevelopment:", process.env.NODE_ENV);
    // Redirect to the payment page
    return NextResponse.json({
      // paymentPageUrl: 'https://checkout.payfort.com/FortAPI/paymentPage',
      paymentPageUrl: process.env.AMAZONE_PAYMENT_URL || "https://sbcheckout.payfort.com/FortAPI/paymentPage",
      payload: paymentPayload,
    });
  } catch (error) {
    logger.error(error);
    console.error("Error in initiate-payment:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
