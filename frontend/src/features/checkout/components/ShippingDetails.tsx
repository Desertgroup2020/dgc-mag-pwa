import { AddressFormValues } from "@/components/address/AddressForm";
import CustomerAddressCard from "@/features/authentication/components/CustomerAddressCartCard";
import useAuth from "@/features/authentication/hooks/useAuth";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import { addCustomerAddress } from "@/features/authentication/slice/auth";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { CartAddressInput } from "@/generated/types";
import { useCountryCodes } from "@/lib/countryCodes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { useAddressContext } from "../hooks/addressContext";
import { updateCart } from "@/features/cart/slice/cart";
import { Button } from "@/components/ui/button";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";

const AddressForm = dynamic(() => import("@/components/address/AddressForm"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

function ShippingDetails() {
  const havingCustomerAddress = useAppSelector(
    (state) => state.auth.value?.addresses?.length
  );
  const customerAddresses = useAppSelector(
    (state) => state.auth.value?.addresses
  );
  const cart = useAppSelector((state) => state.cart.data.cart);
  const currentShippingAddressId = useMemo(
    () => cart?.shipping_addresses?.[0]?.customer_address_id,
    [cart]
  );
  const { countries, emirates } = useCountryCodes();
  const {
    addShippingAddressOnCart: [
      addShippingAddressOnCart,
      addShippingAddressOnCartStatus,
    ],
    addBillingAddressOnCart: [
      addBillingAddressOnCart,
      addBillingAddressOnCartStatus,
    ],
  } = useCartMutations();
  const {
    addCustomerAddress: [addCustomerAddressCall, addCustomerAddressStatus],
  } = useAuth();
  const { sameAsShippingAddress, setIsLoadingSameAsShipping } =
    useAddressContext();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const sortedCustomerAddresses = useMemo(() => {
    if (!customerAddresses || !currentShippingAddressId)
      return customerAddresses;

    return [...customerAddresses].sort((a, b) => {
      if (a?.id === currentShippingAddressId) return -1;
      if (b?.id === currentShippingAddressId) return 1;
      return 0;
    });
  }, [customerAddresses, currentShippingAddressId]);

  // states
  const [openAddAddress, setOpenAddAddress] = useState(false);

  // propreties
  const handleShippingSubmit = ({
    addressFields,
    coords,
    region_id,
  }: {
    addressFields: AddressFormValues;
    coords: google.maps.LatLngLiteral | null;
    region_id?: number | null;
  }) => {
    const currentEmirates = emirates.find((emirate) =>
      emirate.region?.find((region) => region?.id == region_id)
    );
    const selectedRegion = currentEmirates?.region?.find(
      (region) => region?.id == region_id
    );
    const shippingFields: AddressFormValues = {
      ...addressFields,
      telephone: addressFields?.telephone?.replace(/\+/g, ""),
    };
    delete shippingFields.default_billing;
    delete shippingFields.default_shipping;
    delete shippingFields.save_in_address_book;
    delete shippingFields.region;

    // console.log("shipping address fields", shippingFields);
    // console.log("selected region", selectedRegion);

    if (selectedRegion && cart?.id) {
      setIsLoadingSameAsShipping(true);

      addCustomerAddressCall({
        variables: {
          input: {
            ...shippingFields,
            region: {
              region: selectedRegion.name,
              region_code: selectedRegion.code,
              region_id: parseInt(selectedRegion?.id || ""),
            },
            //lan & lng comes here
            custom_attributesV2:
              coords?.lat && coords.lng
                ? [
                    {
                      attribute_code: "latitude",
                      value: `${coords?.lat}`,
                    },
                    {
                      attribute_code: "longitude",
                      value: `${coords?.lng}`,
                    },
                  ]
                : [],
          },
        },
        onCompleted(data, clientOptions) {
          const customerAddressId = data.createCustomerAddress.id;
          if (customerAddressId) {
            dispatch(addCustomerAddress(data.createCustomerAddress));

            addShippingAddressOnCart({
              variables: {
                input: {
                  cart_id: cart.id,
                  shipping_addresses: [
                    {
                      customer_address_id: customerAddressId,
                    },
                  ],
                },
              },
              onCompleted(data, clientOptions) {
                if (data.setShippingAddressesOnCart.cart) {
                  dispatch(updateCart(data.setShippingAddressesOnCart.cart));
                }
                if (
                  data.setShippingAddressesOnCart.cart &&
                  sameAsShippingAddress
                ) {
                  addBillingAddressOnCart({
                    variables: {
                      input: {
                        cart_id: cart.id,
                        billing_address: {
                          customer_address_id: customerAddressId,
                        },
                      },
                    },
                    onCompleted(data, clientOptions) {
                      if (data.setBillingAddressOnCart.cart) {
                        dispatch(updateCart(data.setBillingAddressOnCart.cart));
                        toast({
                          title: "Shipping & Billing Address",
                          description: "Address has been added!",
                          variant: "success",
                        });
                      }
                    },
                  }).finally(() => setIsLoadingSameAsShipping(false));
                } else {
                  setIsLoadingSameAsShipping(false);
                  toast({
                    title: "Shipping Address",
                    description: "Address has been added!",
                    variant: "success",
                  });
                }
              },
            });
          }
        },
      }).finally(() => {
        setOpenAddAddress(false);
      });
    }
  };
  const handleOpenSheet = () => {
    setOpenAddAddress((prev) => !prev);
  };

  return (
    <div className="details shipping_details">
      <h2 className="text-h2">SHIPPING DETAILS</h2>
      {havingCustomerAddress ? (
        <div className="customer_address">
          <ul className="address_card_list">
            {sortedCustomerAddresses?.map((address) => (
              <li key={address?.id}>
                <CustomerAddressCard address={address!} type="shipping" />
              </li>
            ))}
          </ul>
          <div className="add_address_btn">
            <Button
              variant={"action_green"}
              onClick={handleOpenSheet}
              className="btn_action_green_rounded"
            >
              <BtnRightArrow />
              <span>Add Address</span>
            </Button>
          </div>
        </div>
      ) : (
        <AddressForm
          isCustomerAddress={false}
          onSubmit={handleShippingSubmit}
          isSubmiting={
            addShippingAddressOnCartStatus.loading ||
            addBillingAddressOnCartStatus.loading ||
            addCustomerAddressStatus.loading
          }
        />
      )}

      {/* add address form */}
      <SiteSheet
        opts={{ open: openAddAddress, onOpenChange: handleOpenSheet }}
        title="Shipping Address"
        position={winWidth && winWidth < 768 ? "bottom" : "left"}
        className={"shipping_address"}
      >
        <div className="form_outer">
          <AddressForm
            isCustomerAddress={false}
            isSubmiting={
              addShippingAddressOnCartStatus.loading ||
              addBillingAddressOnCartStatus.loading ||
              addCustomerAddressStatus.loading
            }
            onSubmit={handleShippingSubmit}
          />
        </div>
      </SiteSheet>
    </div>
  );
}

export default ShippingDetails;
