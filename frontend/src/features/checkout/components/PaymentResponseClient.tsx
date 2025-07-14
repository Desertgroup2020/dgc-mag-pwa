"use client";

import { fetchCustomer } from "@/features/authentication/slice/auth";
import useGtm from "@/features/google-tag/hooks/useGtm";
import { CustomerOrder } from "@/generated/types";
import makeClient from "@/lib/apollo/apolloProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";

type PaymentResponseClientProps = {
  orderId: string;
};
function PaymentResponseClient({ orderId }: PaymentResponseClientProps) {
  const client = makeClient();
  const dispatch = useAppDispatch();
  const { gtagPurchaseEvent } = useGtm();
  // states
  const [currentOrder, setCurrentOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    dispatch(
      fetchCustomer({
        client,
        onSuccess(customerData) {
          if (customerData.customer.orders?.items) {
            let currentOrder = customerData.customer.orders.items.find(
              (order) => order?.number === orderId
            );
            if (currentOrder) {
              setCurrentOrder(currentOrder);
            }
          }
        },
      })
    );
  }, []);

  useEffect(() => {
    if (currentOrder) {
      gtagPurchaseEvent({
        order: currentOrder,
      });
    }
  }, [currentOrder]);

  return null;
}

export default PaymentResponseClient;
