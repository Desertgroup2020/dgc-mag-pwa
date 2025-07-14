import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerOrder } from "@/generated/types";
import CurrentOrder from "../components/CurrentOrder";
import OrderItem from "../components/OrderItem";
import styles from "../styles/account.module.scss";
import makeClient from "@/lib/apollo/apolloProvider";
import { fetchCustomer } from "@/features/authentication/slice/auth";
import CircularProgress from "@/components/icons/CircularProgress";

function OrdersScreen() {
  // hooks
  const loadOnce = useRef<boolean>(true);
  const searchParams = useSearchParams();
  const recentOrders = useAppSelector(
    (state) => state.auth.value?.orders?.items
  );
  const fetchingCustomer = useAppSelector(
    (state) => state.auth.status === "loading"
  );
  const dispatch = useAppDispatch();
  const client = useRef(makeClient()).current;

  // states
  const [currentOrder, setCurrentOrder] = useState<null | CustomerOrder>(null);

  // effects
  useEffect(() => {
    const orderNumber = searchParams.get("order-number");

    if (orderNumber) {
      const currentOrder = recentOrders?.find(
        (order) => order?.number == orderNumber
      );

      if (currentOrder) {
        setCurrentOrder(currentOrder);
      }
    } else {
      setCurrentOrder(null);
    }
  }, [recentOrders, searchParams]);
  useEffect(() => {
    if (loadOnce.current) {
      loadOnce.current = false;
      dispatch(
        fetchCustomer({
          client,
        })
      );
    }
  }, [dispatch, client]);

  if (fetchingCustomer)
    return (
      <div className="flex flex-col items-center gap-4">
        <CircularProgress width={60} />
        <p className=" text-h3 font-500">Please wait..</p>
      </div>
    );

  if (!recentOrders?.length) {
    return <p className="large_text text-center">No recent Orders!</p>;
  }

  if (currentOrder) {
    return <CurrentOrder order={currentOrder} />;
  }
  const ordersWithHeader = [
    { title: true }, // Special object to denote header
    ...recentOrders,
  ];

  return (
    <div className={`my_orders ${styles.my_orders}`}>
      <h2 className="text-h2 mb-2">My Orders</h2>
      {fetchingCustomer ? (
        <div className="flex flex-col items-center gap-4">
          <CircularProgress width={60} />
          <p className=" text-h3 font-500">Please wait..</p>
        </div>
      ) : (
        <div className="order_list">
          <div className="order_titles grid grid-cols-6 gap-4 py-4 normal_border_bottom ipad:grid-cols-1">
            <h4 className="small_text_regular">Order</h4>
            <h4 className="small_text_regular">Date</h4>
            <h4 className="small_text_regular">Status</h4>
            <h4 className="small_text_regular">Ship To</h4>
            <h4 className="small_text_regular">Order Total</h4>
            <h4 className="small_text_regular">Action</h4>
          </div>
          <div>
            {[...recentOrders]
              .sort(
                (a, b) =>
                  new Date(b?.order_date as string).getTime() -
                  new Date(a?.order_date as string).getTime()
              )
              .map((customerOrder, i) => (
                <OrderItem key={i} order={customerOrder!} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersScreen;
