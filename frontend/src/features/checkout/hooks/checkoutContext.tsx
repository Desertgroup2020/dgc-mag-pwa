"use client";

import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFormik, FormikProps } from "formik";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import useCheckout from "./useCheckout";
import useAmazonPay from "./useAmazonPay";
// import { updateCart } from "@/features/cart/slice/cart";
// import useGtm from "@/features/google-tag/hooks/useGtm";
import useRoute from "@/utils/useRoute";
import { updateRouteChanging } from "@/redux/window/windowSlice";

// Define the CheckoutContextType
interface PlaceOrderFormValues {
  shippingMethod: string;
  paymentMethod: string;
  checkTerms: boolean;
}
type CheckoutContextType = {
  orderCompleted: boolean;
  setOrderCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  orderNumber: string | null;
  setOrderNumber: React.Dispatch<React.SetStateAction<string | null>>;
  formik: FormikProps<PlaceOrderFormValues>; // Adjust the type based on your form values type
  handleModalOpen: () => void;
  placingOrder: boolean;
  redirecting: boolean;
  openPurchaseInputAccValue: "puchase_order" | "close";
  setOpenPurchaseInputAccValue: Dispatch<
    SetStateAction<"puchase_order" | "close">
  >;
};

const checkoutContext = createContext<CheckoutContextType | null>(null);

type CheckoutContextProviderProps = {
  children: ReactNode;
};

const CheckoutContextProvider = ({
  children,
}: CheckoutContextProviderProps) => {
  const { routerPush } = useRoute();
  const {
    placeOrder: [placeOrder, placeOrderStatus],
  } = useCartMutations();
  const { inititalPlaceOrderValues, placeOrderValidationSchema, clearCart } =
    useCheckout();
  const { handleAmazonPay, redirecting, showMessageBeforeRedirect } =
    useAmazonPay();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const customerEmail = useAppSelector((state) => state.auth.value?.email);
  const cart = useAppSelector((state) => state.cart.data.cart);
  const router = useRouter();

  // States
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [openPurchaseInputAccValue, setOpenPurchaseInputAccValue] = useState<
    "puchase_order" | "close"
  >("close");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Features
  const formik = useFormik({
    initialValues: inititalPlaceOrderValues,
    validationSchema: placeOrderValidationSchema,
    onSubmit: (values) => {
      // Handle form submission
      if (cart?.id) {
        placeOrder({
          variables: {
            input: {
              cart_id: cart.id,
            },
          },
          onCompleted(data, clientOptions) {
            // data.placeOrder.orderV2?.number
            if (
              !data.placeOrder.errors.length &&
              data.placeOrder.orderV2?.number
            ) {
              if (cart.selected_payment_method?.code === "cashondelivery") {
                dispatch(updateRouteChanging(true));
                routerPush(
                  `payment-response?payMethod=cod&status=14&merchant_reference=${data.placeOrder.orderV2?.number}`
                ).finally(() => dispatch(updateRouteChanging(false)));
                setOrderCompleted(true);
                setOrderNumber(data.placeOrder.orderV2.number);
                // gtagPurchaseEvent({
                //   order: data.placeOrder.orderV2,
                // });
              } else {
                //amazonpay comes here
                if (
                  cart.prices?.grand_total?.value &&
                  customerEmail &&
                  data.placeOrder.orderV2.number
                )
                  showMessageBeforeRedirect().then(() => {
                    if (
                      cart.prices?.grand_total?.value &&
                      customerEmail &&
                      data?.placeOrder?.orderV2?.number
                    ) {
                      handleAmazonPay({
                        amount: cart.prices?.grand_total?.value,
                        currency: "AED",
                        customer_email: customerEmail,
                        orderId: data.placeOrder.orderV2.number,
                        onRedirect() {
                          // dispatch(updateCart(null));
                        },
                      });
                    }
                  });
              }
            } else {
              toast({
                title: "Place Order",
                description: data.placeOrder.errors?.[0]?.message || "Ooops!",
                variant: "error",
              });
            }
          },
        });
      }
    },
  });

  const handleModalOpen = () => {
    setOrderCompleted((prev) => {
      if (prev) {
        clearCart();
        router.replace("/shopping-cart");
      }

      return !prev;
    });
  };

  // Reset order number on unmount
  useEffect(() => {
    return () => {
      setOrderNumber(null);
    };
  }, []);

  return (
    <checkoutContext.Provider
      value={{
        orderCompleted,
        setOrderCompleted,
        orderNumber,
        setOrderNumber,
        formik,
        handleModalOpen,
        placingOrder: placeOrderStatus.loading,
        redirecting,
        openPurchaseInputAccValue,
        setOpenPurchaseInputAccValue,
      }}
    >
      {children}
    </checkoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(checkoutContext);
  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutContextProvider"
    );
  }
  return context;
};

export default CheckoutContextProvider;
