import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePrice } from "@/utils";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/style.module.scss";
import {
  AvailablePaymentMethod,
  AvailableShippingMethod,
  CartItemInterface,
} from "@/generated/types";
import PaymentMethod from "./PaymentMethod";
import ShippingMethod from "./ShippingMethod";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from "@/components/reusable-uis/Modal";
import { updateCart } from "@/features/cart/slice/cart";
import Smile from "@/components/icons/Smile";
import {
  fetchCustomer,
  updateCustomerCartId,
} from "@/features/authentication/slice/auth";
import { useToast } from "@/components/ui/use-toast";
import CircularProgress from "@/components/icons/CircularProgress";
import { useRouter } from "next/navigation";
import useAmazonPay from "../hooks/useAmazonPay";
import { useCheckoutContext } from "../hooks/checkoutContext";
import useCheckout from "../hooks/useCheckout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import OrderedCartItem from "./OrderedCartItem";
import makeClient from "@/lib/apollo/apolloProvider";

function OrderSummery() {
  // contexts
  const exicuteOnce = useRef<boolean>(true);
  const {
    formik,
    redirecting,
    // orderCompleted,
    handleModalOpen,
    // orderNumber,
    placingOrder,
  } = useCheckoutContext();
  // hooks
  const { clearCart } = useCheckout();

  const cart = useAppSelector((state) => state.cart.data.cart);
  const { renderPrice } = usePrice();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // constats
  const subTotal = useMemo(
    () => cart?.prices?.subtotal_including_tax?.value,
    [cart]
  );
  const grandTotal = useMemo(() => cart?.prices?.grand_total?.value, [cart]);
  const shippingCharge = useMemo(
    () => cart?.shipping_addresses?.[0]?.selected_shipping_method?.amount.value,
    [cart]
  );
  const discounts = useMemo(() => cart?.prices?.discounts, [cart]);
  const totalDiscount = useMemo(() => {
    let totalPrice = 0;
    if (cart?.prices?.discounts?.length) {
      totalPrice = cart?.prices?.discounts?.reduce(
        (acc, item) => acc + (item?.amount?.value || 0),
        0
      );
    }

    return totalPrice;
  }, [cart?.prices?.discounts]);
  const mpReward = useMemo(
    () =>
      cart?.prices?.mp_reward_segments?.find(
        (segment) => segment?.code === "mp_reward_discount"
      ),
    [cart]
  );

  // states

  // features


  // console.log("cart from order summery", cart);

  return (
    <>
      <div className={`order_summery ${styles.order_summery}`}>
        <h2 className="text-h2">ORDER SUMMARY</h2>
        <div className="order_cart_values">
          <div className="cart_items_wrap">
            {cart?.itemsV2?.items.map((cartItem, i) => (
              <OrderedCartItem
                key={cartItem?.uid}
                cartItem={cartItem as CartItemInterface}
              />
            ))}
          </div>
          <div className="sub_total">
            <span className="label">Subtotal</span>
            <span className="value">{renderPrice(subTotal || 0)}</span>
          </div>
          <div className="sub_total">
            <span className="label">Shipping amount</span>
            <span className="value">{renderPrice(shippingCharge || 0)}</span>
          </div>
          {discounts?.length ? (
            <div className="discounts">
              <Accordion
                type="single"
                collapsible
                className="discount_accordian"
              >
                <AccordionItem value="discount" className="acc_item">
                  <AccordionTrigger className="heading">
                    <ChevronDown stroke="#000" className="icon" />
                    <h4>
                      <span className="label">Discounts </span>
                      <span className="total_dis">
                        {renderPrice(totalDiscount || 0)}
                      </span>
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="acc_content">
                    <ul>
                      {discounts.map((discount, i) => (
                        <li key={i}>
                          <span className="label">{discount?.label}</span>
                          <span className="reduced_price">
                            {renderPrice(discount?.amount.value || 0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : null}
          {mpReward ? (
            <div className="sub_total">
              <span className="label">{mpReward.title} &nbsp;</span>
              <span className="value">
                {renderPrice(mpReward.value ? mpReward.value * -1 : 0)}
              </span>
            </div>
          ) : null}

          <div className="total">
            <span className="label">Total</span>
            <span className="value">{renderPrice(grandTotal || 0)}</span>
          </div>
        </div>

        <div className="privacy">
          <p>
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our <Link href={"/privacy-policy"} target="_blank">privacy policy</Link>.
          </p>
        </div>

        <div className="place_order">
          <div className="same_as_wrap">
            <div className={`same_as_checkbox ${styles.same_as_checkbox}`}>
              <input
                type="checkbox"
                id="checkTerms"
                // checked={sameAsShippingAddress}
                {...formik.getFieldProps("checkTerms")}
              />
              <label htmlFor="checkTerms">
                <span className="checker"></span>
                <span className="label">
                  I have read and agree to the website{" "}
                  <Link href={"/terms-condition"} target="_blank">terms and conditions</Link> *
                </span>
              </label>
            </div>
            {formik.errors?.["checkTerms"] ? (
              <div className="error text-left text-red-500 py-1">
                <p>{formik.errors["checkTerms"]}</p>
              </div>
            ) : null}
          </div>
          <Button
            type="submit"
            variant={"action_green"}
            className="btn_action_green_rounded"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            disabled={placingOrder || redirecting}
          >
            {placingOrder || redirecting ? (
              <CircularProgress className="un_anim animate-spin mr-2" />
            ) : (
              <BtnRightArrow />
            )}
            <span>PLACE ORDER</span>
          </Button>
        </div>
      </div>

      {/* order success modal */}
      {/* <Modal
        isOpen={orderCompleted}
        setIsOpen={handleModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content ${styles.order_completed}`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">YOUR ORDER HAS BEEN PLACED!</h2>
            <Link
              href={`/my-account/orders?order-number=${orderNumber}`}
              onClick={(e) => {
                e.preventDefault();
                clearCart();
                router.replace(
                  `/my-account/orders?order-number=${orderNumber}`
                );
              }}
            >
              TRACK YOUR ORDER
            </Link>
            <p>
              <span className=" font-600">{orderNumber}</span>
            </p>
            <Link
              href={"/"}
              onClick={(e) => {
                e.preventDefault();
                clearCart();
                router.replace("/");
              }}
              className="continue"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </Modal> */}
    </>
  );
}

export default OrderSummery;
