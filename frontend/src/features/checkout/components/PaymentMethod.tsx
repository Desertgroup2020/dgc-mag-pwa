import CircularProgress from "@/components/icons/CircularProgress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import {
  AvailablePaymentMethod,
  AvailableShippingMethod,
  PaymentMethodInput,
} from "@/generated/types";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import { useFormik } from "formik";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PaymentMethodType = {
  method: AvailablePaymentMethod;
  onSelect: (methodCode: string) => void;
  openPurchaseInputAccValue: "close" | "puchase_order";
  setOpenPurchaseInputAccValue: Dispatch<
    SetStateAction<"close" | "puchase_order">
  >;
};
function PaymentMethod({
  method,
  onSelect,
  openPurchaseInputAccValue,
  setOpenPurchaseInputAccValue,
}: PaymentMethodType) {
  // hooks
  const { renderPrice } = usePrice();
  const {
    addPaymentMethodOnCart: [
      addPaymentMethodOnCart,
      addPaymentMethodOnCartStatus,
    ]
  } = useCartMutations();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.data.cart);

  //   constands
  const selectedPaymentMethod = useMemo(
    () => cart?.selected_payment_method,
    [cart]
  );
  const validationSchema = Yup.object({
    orderNumber: Yup.string().required("Order number is required"), // Ensures it's a string and not empty
  });

  // states
  const purchaseOrderForm = useFormik({
    initialValues: {
      orderNumber: "",
    },
    validationSchema,
    onSubmit(values, formikHelpers) {
      onPaymentMethodSelect(method?.code as string);
    },
  });

  //   features
  const onPaymentMethodSelect = useCallback(
    (paymentCode: string) => {
      if (
        cart?.id &&
        paymentCode &&
        selectedPaymentMethod?.code !== method.code
      ) {
        addPaymentMethodOnCart({
          variables: {
            input: {
              cart_id: cart.id,
              payment_method: {
                code: paymentCode,
                purchase_order_number:
                  paymentCode === "purchaseorder"
                    ? purchaseOrderForm.values.orderNumber
                    : null,
              },
            },
          },
          onCompleted(data, clientOptions) {
            if (data.setPaymentMethodOnCart.cart) {
              dispatch(updateCart(data.setPaymentMethodOnCart.cart));
              onSelect(paymentCode);
              setOpenPurchaseInputAccValue("close");
            }
          },
        });
      }
    },
    [
      cart?.id,
      selectedPaymentMethod?.code,
      method.code,
      purchaseOrderForm.values.orderNumber,
      addPaymentMethodOnCart,
      dispatch,
      onSelect,
      setOpenPurchaseInputAccValue,
    ]
  );

  // effects
  useEffect(() => {
    if (selectedPaymentMethod?.code) {
      onSelect(selectedPaymentMethod.code);
    }
  }, [selectedPaymentMethod]);

  if (method.code === "purchaseorder") {
    return (
      <Accordion
        type="single"
        collapsible
        className="purchase_accordian"
        value={openPurchaseInputAccValue}
      >
        <AccordionItem value="puchase_order" className="acc_item">
          <AccordionTrigger
            className="heading"
            onClick={() =>
              setOpenPurchaseInputAccValue((prev) =>
                prev === "puchase_order" ? "close" : "puchase_order"
              )
            }
          >
            {/* <ChevronDown stroke="#000" className="icon" /> */}
            <div className="method cursor-pointer" onClick={() => {}}>
              <button
                className={`selection ${
                  method?.code === selectedPaymentMethod?.code ? "selected" : ""
                }`}
              >
                {addPaymentMethodOnCartStatus.loading ? (
                  <CircularProgress width={15} />
                ) : null}
              </button>
              <span className="label">{method?.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="acc_content">
            <div className="purchase_order_input">
              <div className="input_grup">
                <label htmlFor="orderNumber">Purchase order number *</label>
                <div className="input_with_btn">
                  <div className="input">
                    <Input
                      type="text"
                      id="orderNumber"
                      {...purchaseOrderForm.getFieldProps("orderNumber")}
                      error={
                        !!purchaseOrderForm.errors.orderNumber &&
                        !!purchaseOrderForm.touched.orderNumber
                      }
                      errorTxt={purchaseOrderForm.errors.orderNumber}
                    />
                  </div>
                  <div className="input_grup">
                    <Button
                      variant={"itself"}
                      className="w-full submit_btn text-pcard_price normal_btn"
                      type="submit"
                      disabled={addPaymentMethodOnCartStatus.loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        purchaseOrderForm.handleSubmit();
                      }}
                    >
                      <span>select</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div
      className="method cursor-pointer"
      onClick={() => onPaymentMethodSelect(method?.code as string)}
    >
      <button
        className={`selection ${
          method?.code === selectedPaymentMethod?.code ? "selected" : ""
        }`}
      >
        {addPaymentMethodOnCartStatus.loading ? (
          <CircularProgress width={15} />
        ) : null}
      </button>
      <span className="label">{method?.title}</span>
    </div>
  );
}

export default PaymentMethod;
