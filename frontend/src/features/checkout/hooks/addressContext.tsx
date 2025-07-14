"use client";

import { useToast } from "@/components/ui/use-toast";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AddressContextType {
  sameAsShippingAddress: boolean;
  setSameAsShippingAddress: Dispatch<SetStateAction<boolean>>;
  isLoadingSameAsShipping: boolean;
  setIsLoadingSameAsShipping: Dispatch<SetStateAction<boolean>>;
}

const AddressContext = createContext<AddressContextType | null>(null);
interface AddressContextProviderContextType {
  children: React.ReactNode;
}

const AddressContextProvider = ({
  children,
}: AddressContextProviderContextType) => {
  // hooks
  const {
    addBillingAddressOnCart: [
      addBillingAddressOnCart,
      addBillingAddressOnCartStatus,
    ],
  } = useCartMutations();
  const { cart } = useAppSelector((state) => state.cart.data);
  const customer = useAppSelector((state) => state.auth.value);
  const dispacth = useAppDispatch();
  const { toast } = useToast();

  //states
  const [sameAsShippingAddress, setSameAsShippingAddress] = useState(false);
  const [isLoadingSameAsShipping, setIsLoadingSameAsShipping] = useState(false);

  // effects
  useEffect(() => {
    if (
      cart?.billing_address?.customer_address_id !==
      cart?.shipping_addresses?.[0]?.customer_address_id
    ) {
      setSameAsShippingAddress(false);
    } else {
      setSameAsShippingAddress(true);
    }
  }, [cart]);
  useEffect(() => {
    if (sameAsShippingAddress) {
      const currentShippingAddress = cart?.shipping_addresses?.[0];
      const currentBillingAddress = cart?.billing_address;
      const havingCustomerAddress = !!customer?.addresses?.length;

      if (
        !!cart?.id &&
        currentBillingAddress &&
        currentShippingAddress &&
        havingCustomerAddress &&
        currentBillingAddress?.customer_address_id !==
          currentShippingAddress?.customer_address_id
      ) {
        setIsLoadingSameAsShipping(true);

        addBillingAddressOnCart({
          variables: {
            input: {
              cart_id: cart.id,
              billing_address: {
                customer_address_id:
                  currentShippingAddress?.customer_address_id,
              },
            },
          },
          onCompleted(data, clientOptions) {
            if (data.setBillingAddressOnCart.cart) {
              dispacth(updateCart(data.setBillingAddressOnCart.cart));

              toast({
                title: "Shipping & Billing Address",
                description: "Billing & Shipping addresses are same now",
                variant: "success",
              });
            }
          },
        }).finally(() => setIsLoadingSameAsShipping(false));
      }
    }
  }, [sameAsShippingAddress]);

  const golbalControls = {
    sameAsShippingAddress,
    setSameAsShippingAddress,
    isLoadingSameAsShipping: isLoadingSameAsShipping,
    setIsLoadingSameAsShipping: setIsLoadingSameAsShipping,
  };

  return (
    <AddressContext.Provider value={golbalControls}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddressContext = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error(
      "usePdpContext must be used within a AddressContextProvider"
    );
  }
  return context;
};

export default AddressContextProvider;
