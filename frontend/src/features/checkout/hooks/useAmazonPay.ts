"use client";

import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";

function useAmazonPay() {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();
  // states

  type HandleAmazonPayProps = {
    amount: number;
    currency: "AED";
    orderId: string;
    customer_email: string;
    onRedirect: ()=> void;
  };

  const showMessageBeforeRedirect = () => {
    return new Promise<void>((resolve) => {
      alert("You will be redirected to the payment page. Please do not refresh or close the page to avoid payment-related issues.");
      setTimeout(() => {
        resolve();
      }, 3000); // Adjust the timeout duration as needed
    });
  };

  const handleAmazonPay = async ({
    amount,
    currency = "AED",
    customer_email,
    orderId,
    onRedirect
  }: HandleAmazonPayProps) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/payfort", {
        amount: amount * 100, // Example amount in smallest unit
        currency,
        orderId,
        customer_email,
      });

      // Redirect to Payfort payment page
      const form = document.createElement("form");
      form.action = data.paymentPageUrl;
      form.method = "POST";

      // Append payload as hidden fields
      Object.entries(data.payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);      
      form.submit();      
      onRedirect();
    } catch (error) {
      console.error("Payment initiation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAmazonPay,
    redirecting: loading,
    showMessageBeforeRedirect
  };
}

export default useAmazonPay;
