import { AddressFormValues } from "@/components/address/AddressForm";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CustomerAddressMainCard from "@/features/authentication/components/CustomerAddressCard";
import useAuth from "@/features/authentication/hooks/useAuth";
import {
  addCustomerAddress,
  updateCustomerAddress,
} from "@/features/authentication/slice/auth";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { updateCart } from "@/features/cart/slice/cart";
import { useCountryCodes } from "@/lib/countryCodes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import dynamic from "next/dynamic";
import styles from "../styles/account.module.scss";
import React, { useState } from "react";

const AddressForm = dynamic(() => import("@/components/address/AddressForm"), {
  ssr: false,
  loading: () => <>Loading...</>,
});

function AddressBookScreen() {
  // hooks
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.data.cart);
  const { toast } = useToast();
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const customerAddresses = useAppSelector(
    (state) => state.auth.value?.addresses
  );
  const { countries, emirates } = useCountryCodes();
  const {
    addCustomerAddress: [addCustomerAddressCall, addCustomerAddressStatus],
  } = useAuth();
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

  // states
  const [openAddAddress, setOpenAddAddress] = useState(false);

  // features
  const addressSuccessToast = () => {
    toast({
      title: "Address",
      description: "Address has been added!",
      variant: "success",
    });
  };
  const handleAddressSubmit = ({
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
    const computedAddressFields: AddressFormValues = {
      ...addressFields,
      telephone: addressFields?.telephone?.replace(/\+/g, ""),
    };
    delete computedAddressFields.default_billing;
    delete computedAddressFields.default_shipping;
    delete computedAddressFields.save_in_address_book;
    delete computedAddressFields.region;

    // console.log("selected region", selectedRegion);

    if (selectedRegion) {
      addCustomerAddressCall({
        variables: {
          input: {
            ...computedAddressFields,
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
          if (data.createCustomerAddress) {
            dispatch(addCustomerAddress(data.createCustomerAddress));
          }
          if (addressFields.default_shipping && cart?.id) {
            addShippingAddressOnCart({
              variables: {
                input: {
                  cart_id: cart?.id,
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
              },
            });
          }
          if (addressFields.default_billing && cart?.id) {
            addBillingAddressOnCart({
              variables: {
                input: {
                  cart_id: cart?.id,
                  billing_address: {
                    customer_address_id: customerAddressId,
                  },
                },
              },
              onCompleted(data, clientOptions) {
                if (data.setBillingAddressOnCart.cart) {
                  dispatch(updateCart(data.setBillingAddressOnCart.cart));
                }
              },
            });
          }

          if (
            !addressFields.default_billing ||
            !addressFields.default_shipping
          ) {
            addressSuccessToast();
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
    <div className={`address_book ${styles.address_book}`}>
      <h2 className="text-h2 mb-2">My Addresses</h2>

      <div className="addressbook_add_address_btn">
        <Button
          variant={"action_green"}
          onClick={handleOpenSheet}
          className="btn_action_green_rounded mb-2"
        >
          <BtnRightArrow />
          <span>ADD NEW ADDRESS</span>
        </Button>
      </div>
      <div className="address_list">
        {customerAddresses?.map((address) => (
          <CustomerAddressMainCard key={address?.id} address={address!} />
        ))}
      </div>

      {/* add address form */}
      <SiteSheet
        opts={{ open: openAddAddress, onOpenChange: handleOpenSheet }}
        title="Add Address"
        // position={winWidth && winWidth < 768 ? "bottom" : "left"}
        position="right"
        className={"overflow-auto shipping_address"}
        // notCloseOnOutside={true}
      >
        <div className="form_outer">
          <AddressForm
            isCustomerAddress
            isSubmiting={
              addCustomerAddressStatus.loading ||
              addBillingAddressOnCartStatus.loading ||
              addShippingAddressOnCartStatus.loading
            }
            onSubmit={handleAddressSubmit}
          />
        </div>
      </SiteSheet>
    </div>
  );
}

export default AddressBookScreen;
