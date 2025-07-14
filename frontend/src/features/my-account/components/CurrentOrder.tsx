import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { CustomerOrder, ProductInterface } from "@/generated/types";
import { useAppDispatch } from "@/redux/hooks";
import { usePrice } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import styles from "../styles/account.module.scss";
import OrderedProduct from "./OrderedProduct";
import OrderStatusBlock, { OrderStatus } from "./OrderStatusBlock";

type OrderItemProps = {
  order: CustomerOrder;
};
function CurrentOrder({ order }: OrderItemProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    reOrder: [reOrder, reOrderStatus],
  } = useCartMutations();
  const { toast, dismiss } = useToast();

  const { renderPrice } = usePrice();

  // computed
  const orderNumber = useMemo(() => order.number, [order]);
  const orderedDate = useMemo(() => order.order_date, [order]);
  const orderStatus = useMemo(() => order.status, [order]);
  const shipToAddress = useMemo(() => order.shipping_address, [order]);
  const orderTotalAmount = useMemo(
    () => order.total?.grand_total?.value,
    [order]
  );
  const shippingMethod = useMemo(() => order.shipping_method, [order]);
  const billinInformation = useMemo(() => order.billing_address, [order]);
  const Total = useMemo(() => order.total, [order]);
  const discount = useMemo(
    () => order.total?.discounts?.[0]?.amount?.value || 0,
    [order]
  );
  const orderedProducts = useMemo(
    () =>
      order.items?.reduce<ProductInterface[]>((acc, item) => {
        if (item?.product) {
          acc.push(item.product as ProductInterface);
        }
        return acc;
      }, [] as ProductInterface[]),
    [order]
  );
  // console.log("SINGLE ORDER products", orderedProducts);

  // features
  const handleReOrder = () => {
    if (orderNumber) {
      reOrder({
        variables: {
          orderNumber,
        },
        onCompleted(data, clientOptions) {
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

  return (
    <div className={`current_order ${styles.current_order}`}>     
      <div className="client_details">
        <div className="order_date_number">
          <span className="order_number">{orderNumber}</span>
          <span className="ordered_date">Ordered at&nbsp;{orderedDate}</span>
        </div>
        <div className="delivery_address">
          <h3>Delivery address</h3>
          <address>
            {shipToAddress?.firstname} {shipToAddress?.lastname},{" "}
            {shipToAddress?.region} {shipToAddress?.city} <br />
            {shipToAddress?.postcode}, {shipToAddress?.country_code}
          </address>
        </div>

        <div className="order_actions">
          <button className="op_btns " onClick={() => router.back()}>
            <span>Back to orders</span>
          </button>
          <button onClick={() => handleReOrder()} className="op_btns ">
            Re-Order
          </button>
        </div>
      </div>
      <div className="order_details">
        <div className="product_block">
          <div className="products_wrap">
            {orderedProducts?.map((product) => (
              <OrderedProduct product={product} key={product.sku} />
            ))}
          </div>
          <div className="order_total">
            <span className="label">Order Total:</span>
            <span className="value">{renderPrice(orderTotalAmount || 0)}</span>
          </div>
        </div>
        <div className="status_block">
          <OrderStatusBlock status={orderStatus as OrderStatus} />
        </div>
      </div>
    </div>
  );
}

export default CurrentOrder;
