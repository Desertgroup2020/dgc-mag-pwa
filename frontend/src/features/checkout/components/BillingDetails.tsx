import { AddressFormValues } from "@/components/address/AddressForm";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CustomerAddressCard from "@/features/authentication/components/CustomerAddressCartCard";
import useAuth from "@/features/authentication/hooks/useAuth";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import { addCustomerAddress } from "@/features/authentication/slice/auth";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { CartAddressInput, Customer } from "@/generated/types";
import { useCountryCodes } from "@/lib/countryCodes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

const AddressForm = dynamic(() => import("@/components/address/AddressForm"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

function BillingDetails() {
  // const { havingCustomerAddress, customerAddresses } = useCustomer();
  const havingCustomerAddress = useAppSelector(
    (state) => state.auth.value?.addresses?.length
  );
  const customerAddresses = useAppSelector(
    (state) => state.auth.value?.addresses
  );
  const { countries, emirates } = useCountryCodes();
  const {
    addBillingAddressOnCart: [
      addBillingAddressOnCart,
      addBillingAddressOnCartStatus,
    ],
  } = useCartMutations();
  const {
    addCustomerAddress: [addCustomerAddressCall, addCustomerAddressStatus],
  } = useAuth();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.data.cart);
  const { toast } = useToast();
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const currentBillingAddressId = useMemo(
    () => cart?.billing_address?.customer_address_id,
    [cart]
  );
  const sortedCustomerAddresses = useMemo(() => {
    if (!customerAddresses || !currentBillingAddressId)
      return customerAddresses;

    return [...customerAddresses].sort((a, b) => {
      if (a?.id === currentBillingAddressId) return -1;
      if (b?.id === currentBillingAddressId) return 1;
      return 0;
    });
  }, [customerAddresses, currentBillingAddressId]);

  // states
  const [openAddAddress, setOpenAddAddress] = useState(false);

  //   features
  const handleBillingSubmit = ({
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
    const billingFields: AddressFormValues = {
      ...addressFields,
      telephone: addressFields?.telephone?.replace(/\+/g, ""),
    };
    delete billingFields.default_billing;
    delete billingFields.default_shipping;
    delete billingFields.save_in_address_book;
    delete billingFields.region;

    if (cart?.id && selectedRegion) {
      addCustomerAddressCall({
        variables: {
          input: {
            ...billingFields,
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
                    title: "Billing Address",
                    description: "Address has been added!",
                    variant: "success",
                  });
                }
              },
            });
          }
        },
      });
    }
  };
  const handleOpenSheet = () => {
    setOpenAddAddress((prev) => !prev);
  };

  return (
    <div className="details billing_details">
      <h2 className="text-h2">BILLING DETAILS</h2>
      {havingCustomerAddress ? (
        <div className="customer_address">
          <ul className="address_card_list">
            {sortedCustomerAddresses?.map((address) => (
              <li key={address?.id}>
                <CustomerAddressCard address={address!} type="billing" />
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
          onSubmit={handleBillingSubmit}
          isSubmiting={addBillingAddressOnCartStatus.loading}
        />
      )}

      {/* add address form */}
      <SiteSheet
        opts={{ open: openAddAddress, onOpenChange: handleOpenSheet }}
        title="Billing Address"
        position={winWidth && winWidth < 768 ? "bottom" : "left"}
        className={"shipping_address"}
      >
        <div className="form_outer">
          <AddressForm
            isCustomerAddress={false}
            isSubmiting={
              addBillingAddressOnCartStatus.loading ||
              addCustomerAddressStatus.loading
            }
            onSubmit={handleBillingSubmit}
          />
        </div>
      </SiteSheet>
    </div>
  );
}

export default BillingDetails;
