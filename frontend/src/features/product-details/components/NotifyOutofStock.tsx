// import CircularProgress from "@/components/icons/CircularProgress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const CircularProgress = dynamic(
  () => import("@/components/icons/CircularProgress")
);

function NotifyOutofStock({
  stockStatus,
  sku,
}: {
  stockStatus: string;
  sku: string;
}) {
  // hooks
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const {
    notifyProduct: [notifyProduct, notifyProductStatus],
  } = useCartMutations();

  // states
  const token = useAppSelector((state) => state.auth.token);
  const [notifying, setNotifying] = useState(false);

  // features
  const handleNotify = () => {
    setNotifying(true);
    if (!token) {
      router.push(`${pathname}?signin=dgc-login`);
      setNotifying(false);
    } else {
      notifyProduct({
        variables: {
          sku: sku,
          type: "PRODUCT_ALERT_STOCK",
        },
        onCompleted(data, clientOptions) {
          if (data.productAlertSubscribe) {
            toast({
              variant: "success",
              title: "Notify product",
              description: "You saved the alert subscription.",
            });
          }
        },
      }).finally(() => setNotifying(false));
    }
  };

  return (
    <div className="stock_status out_stock">
      <span className="status">{stockStatus}</span>
      <Button className="normal_btn notify" onClick={handleNotify} disabled={notifying}>
        <span>Notify Me</span>
        {notifying ? <CircularProgress stroke="#000" /> : null}
      </Button>
    </div>
  );
}

export default NotifyOutofStock;
