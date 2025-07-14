import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useMemo } from "react";
import { logout } from "../slice/auth";
import { Customer } from "@/generated/types";
import { updateWishlist } from "@/features/wishlist/slice/wishlist";
import { useBlocking } from "../components/blockingContext";
import { updateCart } from "@/features/cart/slice/cart";

type UseCustomerType = {
  customer: Customer;
};
function useCustomer() {
  const customer = useAppSelector((state) => state.auth.value);
  const { clearBlocking } = useBlocking();
  const dispatch = useAppDispatch();

  const havingCustomerAddress = useMemo(
    () => !!customer?.addresses?.length,
    [customer]
  );
  const customerAddresses = useMemo(() => customer?.addresses, [customer]);
  const customerFirstName = useMemo(() => customer?.firstname, [customer]);
  const customerLastName = useMemo(() => customer?.lastname, [customer]);
  const customerEmail = useMemo(() => customer?.email, [customer]);
  const customerMobile = useMemo(() => customer?.mobilenumber, [customer]);
  const customerId = useMemo(() => customer?.id, [customer]);

  // features
  const handleLogOut = () => {
    if (customer) {
      dispatch(updateCart(null));
      dispatch(updateWishlist(null));
      dispatch(logout());
      clearBlocking();
    }
  };

  return {
    havingCustomerAddress,
    customerAddresses,
    customerFirstName,
    customerLastName,
    customerEmail,
    handleLogOut,
    customerMobile,
    customerId,
  };
}

export default useCustomer;
