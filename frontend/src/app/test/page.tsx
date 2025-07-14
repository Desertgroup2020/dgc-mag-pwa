"use client";

import { useEffect, useState } from "react";

const ApplePayButton = () => {
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  useEffect(() => {
    if (window.ApplePaySession) {
      // Directly check if Apple Pay can make payments
      const canMakePayments = ApplePaySession.canMakePayments();
      setApplePayAvailable(!!canMakePayments); // Ensure it's a boolean
    }
  }, []);

  const handleApplePay = async () => {
    const paymentRequest = {
      countryCode: "AE",
      currencyCode: "AED",
      total: {
        label: "DGC",
        amount: "10.00",
      },
      supportedNetworks: ["visa", "masterCard", "amex"],
      merchantCapabilities: ["supports3DS"],
    };

    const session = new ApplePaySession(3, paymentRequest);

    // console.log("session", session);
    

    session.onvalidatemerchant = async (event) => {
      // console.log("validation merchant", event);

      // Send event.validationURL to your backend for validation
      try {
        const response = await fetch("/api/validate-merchant", {
          method: "POST",
          body: JSON.stringify({ validationURL: event.validationURL }),
          headers: { "Content-Type": "application/json" },
        });
        const merchantSession = await response.json();
        session.completeMerchantValidation(merchantSession);
      } catch (err) {
        throw err;
      }
    };

    session.onpaymentauthorized = async (event) => {
      // Process the payment token
      // console.log("payment authorization");
      try {
        const response = await fetch("/api/apple-pay", {
          method: "POST",
          body: JSON.stringify({ token: event.payment.token }),
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();

        if (result.success) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      } catch (err) {
        throw err;
      }
    };

    try {
      session.begin();
    } catch (err) {
      console.error("Failed to start Apple Pay session:", err);
    }
  };

  return applePayAvailable ? (
    <button onClick={handleApplePay} className="apple-pay-button">
      Pay with Apple Pay
    </button>
  ) : null;
};

export default ApplePayButton;
