import * as Yup from "yup";
import React from "react";
import { useAppDispatch } from "@/redux/hooks";
import { updateCart } from "@/features/cart/slice/cart";
import { updateCustomerCartId } from "@/features/authentication/slice/auth";

function useCheckout() {
  // hooks
  const dispatch = useAppDispatch();
  // place order form
  const inititalPlaceOrderValues = {
    shippingMethod: "",
    paymentMethod: "",
    checkTerms: false,
  };
  // Validation schema
  const placeOrderValidationSchema = Yup.object().shape({
    shippingMethod: Yup.string().required("Shipping method is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
    checkTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });
  const clearCart = () => {
    dispatch(updateCart(null));
    dispatch(updateCustomerCartId(null));
  };

  return {
    inititalPlaceOrderValues,
    placeOrderValidationSchema,
    clearCart
  };
}

export default useCheckout;
