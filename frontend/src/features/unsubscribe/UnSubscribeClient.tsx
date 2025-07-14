"use client";

import React, { useState } from "react";
import useMutations from "./hooks/useMutations";
import { Button } from "@/components/ui/button";
import CircularProgress from "@/components/icons/CircularProgress";
import Modal from "@/components/reusable-uis/Modal";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { withAuth } from "@/hocs/ProtectedRoutes";
import { useAppSelector } from "@/redux/hooks";

function UnSubscribeClient({
  productId,
  type,
}: {
  productId: string;
  type: string;
}) {
  // hooks
  const {
    productUnsubscribe: [productUnsubscribe, productUnsubscribeStatus],
  } = useMutations();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const pathname = usePathname();

  //   computed
  const productIdInt = parseInt(productId);

  //   states
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [unsubscribedMsg, setUnsubscribedMsg] = useState("");

  //   features
  const handleUnsubscribe = () => {
    if (token) {
      productUnsubscribe({
        variables: productId
          ? {
              productId: productIdInt,
              type: type,
            }
          : { type: type },
        onCompleted(data, clientOptions) {
          if (data.productAlertUnsubscribe.message) {
            setUnsubscribedMsg(data.productAlertUnsubscribe.message);
            setUnsubscribed(true);
          }
        },
      });
    } else {
      router.replace(
        `${pathname}?${type ? `type=${type}&` : ``}${
          productId ? `productId=${productId}&` : ``
        }signin=dgc-login`
      );
    }
  };
  const handleModalOpen = () => {
    setUnsubscribed((prev) => {
      if (prev) {
        router.replace("/");
      }
      return !prev;
    });
  };

  return (
    <>
      <div className="product_unsubscribe">
        <div className="container">
          <div className="contents">
            <h1 className=" text-h1">Are you sure want to Unsubscribe!</h1>

            <div className="btn_groups">
              <Button
                className="apply_now_button normal_btn submit_btn"
                disabled={productUnsubscribeStatus.loading}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
              >
                <span>Stay Connected</span>
              </Button>
              <button
                disabled={productUnsubscribeStatus.loading}
                className="unsub"
                onClick={handleUnsubscribe}
              >
                <span>Unsubscribe</span>
                {productUnsubscribeStatus.loading ? <CircularProgress /> : null}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* order success modal */}
      <Modal
        isOpen={unsubscribed}
        setIsOpen={handleModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">Unsubscribed Successfully!</h2>
            <Link
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                router.replace("/");
              }}
              className="continue"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default withAuth(UnSubscribeClient);
