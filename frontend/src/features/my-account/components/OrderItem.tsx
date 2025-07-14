import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { CustomerOrder } from "@/generated/types";
import { useAppDispatch } from "@/redux/hooks";
import { usePrice } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo } from "react";

type OrderItemProps = {
  order: CustomerOrder;
};

function OrderItem({ order }: OrderItemProps) {
  // hooks
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reOrder: [reOrder, reOrderStatus],
  } = useCartMutations();
  const { renderPrice } = usePrice();
  const { toast, dismiss } = useToast();

  // computed
  const orderNumber = useMemo(() => order.number, [order]);
  const orderedDate = useMemo(() => order.order_date, [order]);
  const orderStatus = useMemo(() => order.status, [order]);
  const shipToAddress = useMemo(() => order.shipping_address, [order]);
  const orderTotalAmount = useMemo(
    () => order.total?.grand_total.value,
    [order]
  );

  // Reorder function
  const handleReOrder = () => {
    if (orderNumber) {
      reOrder({
        variables: {
          orderNumber,
        },
        onCompleted(data) {
          if (
            !data.reorderItems.userInputErrors.length &&
            data.reorderItems.cart
          ) {
            dispatch(updateCart(data.reorderItems.cart));

            toast({
              variant: "success",
              title: "Re-order",
              description: "Updated the cart with the order items",
            });
          } else if (data.reorderItems.userInputErrors.length) {
            toast({
              variant: "error",
              title: "Re-order",
              description:
                data.reorderItems.userInputErrors?.[0]?.message || "Ooops!",
            });
          }
        },
      });
    }
  };

  //console.log("order", order);

  return (
    <div>
      <div className="order_details grid grid-cols-6 ipad:grid-cols-3 mobile:grid-cols-2 gap-4 py-2 normal_border_bottom">
        <div>
          <span className="label from_ipad">Order: </span>
          <p>{orderNumber}</p>
        </div>
        <div>
          <span className="label from_ipad">Date: </span>
          <p>{orderedDate}</p>
        </div>
        <div>
          <span className="label from_ipad">Status: </span>
          <p>{orderStatus}</p>
        </div>
        <div>
          <span className="label from_ipad">Ship To: </span>
          <address>
            {shipToAddress?.firstname} {shipToAddress?.lastname},{" "}
            {shipToAddress?.region} {shipToAddress?.city} <br />
            {shipToAddress?.postcode}, {shipToAddress?.country_code}
          </address>
        </div>
        <div>
          <span className="label from_ipad">Order Total</span>
          <p className="price">{renderPrice(orderTotalAmount || 0)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="label from_ipad">Action: </span>
          <button
            className="op_btns w-full"
            disabled={reOrderStatus.loading}
            onClick={() =>
              router.push(`${pathname}?order-number=${orderNumber}`)
            }
          >
            View Order
          </button>
          <button
            className="op_btns w-full"
            onClick={handleReOrder}
            disabled={reOrderStatus.loading}
          >
            Re-order
          </button>
        </div>
      </div>
      {/* <div className="res_table pb-2">
        <table className="divide-y w-full">
        
          <tbody className="normal_table_border">
            <tr>
              <td className="p-2  whitespace-nowrap text-sm font-medium text-gray-900">
                Order
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700 text-right">
                {orderNumber}
              </td>
            </tr>
            <tr>
              <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900 ">
                Date
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700 text-right">
                {orderedDate}
              </td>
            </tr>
            <tr>
              <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                Status
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700 text-right">
                {orderStatus}
              </td>
            </tr>
            <tr>
              <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                Ship To
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700 text-right">
                {shipToAddress?.firstname} {shipToAddress?.lastname},<br />
                {shipToAddress?.region?.[0]} {shipToAddress?.city} <br />
                {shipToAddress?.postcode}, {shipToAddress?.country_code}
              </td>
            </tr>
            <tr>
              <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                Order Total
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700 text-right">
                {orderTotalAmount}
              </td>
            </tr>
            <tr>
              <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                Action
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-gray-700">
                <div className="flex flex-col gap-2">
                  <button
                    className="op_btns"
                    disabled={reOrderStatus.loading}
                    onClick={() =>
                      router.push(`${pathname}?order-number=${orderNumber}`)
                    }
                  >
                    View Order
                  </button>
                  <button
                    className="op_btns w-full"
                    onClick={handleReOrder}
                    disabled={reOrderStatus.loading}
                  >
                    Re-order
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default OrderItem;
