"use client";

import BtnRightArrow from "@/components/icons/BtnRightArrow";
import Smile from "@/components/icons/Smile";
import { Button } from "@/components/ui/button";
import PaymentResponseClient from "@/features/checkout/components/PaymentResponseClient";
import useCheckout from "@/features/checkout/hooks/useCheckout";
import { withAuth } from "@/hocs/ProtectedRoutes";
import { useAppSelector } from "@/redux/hooks";
import { Ban } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

type PaymentResponseprops = {
  params: {
    slug: string[];
  };
  searchParams: {
    status: string;
    response_message: string;
    merchant_reference: string;
    amount: string;
    payMethod: "cod" | "net"
  };
};
function PaymentResponse(ctx: PaymentResponseprops) {
  const exicuteOnce = useRef<boolean>(true);  
  const { amount, response_message, status, merchant_reference, payMethod } =
    ctx.searchParams;
  const { clearCart } = useCheckout();
  const cartId = useAppSelector((state) => state.cart.data.cart?.id);

  // computed
  const isSuccess = status === "14";
  const cod = payMethod === "cod";

  return (
    <div className="amazone_response">
      {isSuccess ? (
        <PaymentResponseClient orderId={merchant_reference} />
      ) : null}
      <div className="container">
        {!cod ? <h1 className=" text-h1 text-center">Payment Status</h1> : null}

        <div className="status_view">
          {isSuccess ? (
            <div className="success">
              <Smile width={120} />
              <div className="txt">
                <p>{!cod ? response_message : "YOUR ORDER HAS BEEN PLACED!"}</p>
                <Link
                  href={`/my-account/orders?order-number=${merchant_reference}`}
                >
                  TRACK YOUR ORDER #{merchant_reference}
                </Link>
              </div>
            </div>
          ) : (
            <div className="success">
              <Ban width={80} height={80} stroke="red" />
              <div className="txt">
                <p>{cod ? response_message : "Something went wrong!"}</p>
              </div>
              <Link
                href={`/my-account/orders?order-number=${merchant_reference}`}
              >
                TRACK YOUR ORDER #{merchant_reference}
              </Link>
            </div>
          )}

          <Link href={`/`}>
            <Button
              variant={"action_green"}
              className="btn_action_green_rounded"
            >
              <BtnRightArrow />
              <span>CONTINUE SHOPPING</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PaymentResponse);
