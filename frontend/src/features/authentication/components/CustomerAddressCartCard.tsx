import {
  Country,
  CustomerAddress,
  CustomerAddressInput,
} from "@/generated/types";
import styles from "../../checkout/styles/style.module.scss";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCountryCodes } from "@/lib/countryCodes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useCartMutations from "@/features/cart/hooks/useCartMutations";
import { useAddressContext } from "@/features/checkout/hooks/addressContext";
import { updateCart } from "@/features/cart/slice/cart";
import CircularProgress from "@/components/icons/CircularProgress";
import { useToast } from "@/components/ui/use-toast";
import { Edit } from "lucide-react";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import AddressForm, {
  AddressFormValues,
} from "@/components/address/AddressForm";
import useAuth from "../hooks/useAuth";
import { updateCustomerAddress } from "../slice/auth";

type CustomerAddressCardProps = {
  address: CustomerAddress;
  type: "shipping" | "billing";
};
function CustomerAddressCard({ address, type }: CustomerAddressCardProps) {
  // hooks
  const { countries, emirates } = useCountryCodes();
  const cart = useAppSelector((state) => state.cart.data.cart);
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
    updateCustomerAddress: [
      updateCustomerAddressCall,
      updateCustomerAddressStatus,
    ],
  } = useAuth();
  const { sameAsShippingAddress, setIsLoadingSameAsShipping } =
    useAddressContext();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // constands
  const isSelected = useMemo(() => {
    if (type === "shipping") {
      return cart?.shipping_addresses?.[0]?.customer_address_id === address.id;
    } else {
      return cart?.billing_address?.customer_address_id === address.id;
    }
  }, [cart, type, address]);
  const isSelecting = useMemo(
    () =>
      addShippingAddressOnCartStatus.loading ||
      addBillingAddressOnCartStatus.loading,
    [
      addBillingAddressOnCartStatus.loading,
      addShippingAddressOnCartStatus.loading,
    ]
  );
  const customerAddressEditFields = useMemo(() => {
    const inputFieldTobeEdited = {
      ...address,
    };

    // delete inputFieldTobeEdited.telephone;
    delete inputFieldTobeEdited.region;

    return inputFieldTobeEdited;
  }, [address]);
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  // states
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // features
  const onAddressSelect = useCallback(() => {
    const currentShippingAddressCustomerAddressId =
      cart?.shipping_addresses?.[0]?.customer_address_id;
    if (
      type === "shipping" &&
      currentShippingAddressCustomerAddressId !== address.id &&
      cart?.id
    ) {
      setIsLoadingSameAsShipping(true);
      addShippingAddressOnCart({
        variables: {
          input: {
            cart_id: cart.id,
            shipping_addresses: [
              {
                customer_address_id: address.id,
              },
            ],
          },
        },
        onCompleted(data, clientOptions) {
          if (data.setShippingAddressesOnCart.cart) {
            dispatch(updateCart(data.setShippingAddressesOnCart.cart));
          }
          if (data.setShippingAddressesOnCart.cart && sameAsShippingAddress) {
            addBillingAddressOnCart({
              variables: {
                input: {
                  cart_id: cart.id,
                  billing_address: {
                    customer_address_id: address.id,
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
    } else if (cart?.id) {
      addBillingAddressOnCart({
        variables: {
          input: {
            cart_id: cart.id,
            billing_address: {
              customer_address_id: address.id,
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
  }, [
    addBillingAddressOnCart,
    addShippingAddressOnCart,
    address.id,
    cart?.id,
    cart?.shipping_addresses,
    dispatch,
    sameAsShippingAddress,
    setIsLoadingSameAsShipping,
    toast,
    type,
  ]);
  const onUpdateAddress = ({
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
    const updateFields: AddressFormValues = {
      ...addressFields,
      telephone: addressFields?.telephone?.replace(/\+/g, ""),
    };
    delete updateFields.default_billing;
    delete updateFields.default_shipping;
    delete updateFields.save_in_address_book;
    delete updateFields.region;

    // console.log("selected region on card", selectedRegion);
    // console.log("address field on card", addressFields.region);

    updateCustomerAddressCall({
      variables: {
        id: address.id as number,
        input: {
          ...updateFields,
          region: {
            region: selectedRegion?.name,
            region_code: selectedRegion?.code,
            region_id: parseInt(selectedRegion?.id || ""),
          },
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
        if (data.updateCustomerAddress) {
          dispatch(updateCustomerAddress(data.updateCustomerAddress));
          toast({
            title: address.firstname || "Customer Address",
            description: "Address has been updated!",
            variant: "success",
          });
        }
      },
    }).finally(() => setOpenAddAddress(false));
  };
  const handleOpenSheet = () => {
    setOpenAddAddress((prev) => !prev);
  };

  // effects
  useEffect(() => {
    if (countries.length) {
      const selectedCountry = countries.find(
        (country) => country.id === address.country_code
      );

      if (selectedCountry) {
        setSelectedCountry(selectedCountry);
      }
    }
  }, [countries, address]);

  // logs
  // console.log("is selected", isSelected);

  return (
    <>
      <div
        className={`address_card ${styles.address_card} ${
          isSelected && !isSelecting ? "selected" : ""
        }`}
      >
        <div className="name_phone">
          <span className="name">
            {address.firstname}&nbsp;{address.lastname}
          </span>
        </div>
        <address>
          <span className="phone">+{address.telephone}</span>
          <br />
          {address.street?.[0]}&nbsp;{address.street?.[1]},&nbsp;{address.city}
          ,&nbsp;
          {address.region?.region} <br /> {selectedCountry?.full_name_english}{" "}
          <br />
          {address.postcode ? address.postcode : null}
        </address>

        <button
          className={`selector ${isSelected && !isSelecting ? "selected" : ""}`}
          onClick={onAddressSelect}
        >
          {isSelecting ? <CircularProgress width={10} /> : null}
        </button>
        <button className="edit_address" onClick={handleOpenSheet}>
          <Edit stroke="#7e8b53" size={20} />
        </button>
      </div>
      <SiteSheet
        opts={{ open: openAddAddress, onOpenChange: handleOpenSheet }}
        title="Edit Address"
        position={winWidth && winWidth < 768 ? "bottom" : "left"}
        className={"shipping_address"}
      >
        <div className="form_outer">
          <AddressForm
            isCustomerAddress={false}
            isSubmiting={updateCustomerAddressStatus.loading}
            onSubmit={onUpdateAddress}
            editAddress={
              {
                ...customerAddressEditFields,
                region_id: address.region?.region_id,
                region: address.region?.region,
              } as AddressFormValues
            }
          />
        </div>
      </SiteSheet>
    </>
  );
}

export default CustomerAddressCard;
