import React from "react";
import { KeyValuePair } from "../[...slug]/page";
import OrderFeedback from "@/features/checkout/components/OrderFeedback";
import { notFound } from "next/navigation";

function FeedbackPage({ searchParams }: { searchParams: KeyValuePair }) {
  const orderId = parseInt(searchParams.orderId as string);
  
  if(!orderId) notFound();
  return (
    <div className="order_feedback">
      <div className="common_banner">
        <div className="container">
          <h1 className="text-h1">Order Feedback</h1>
        </div>
      </div>
      <OrderFeedback orderId={orderId}/>
    </div>
  );
}

export default FeedbackPage;
