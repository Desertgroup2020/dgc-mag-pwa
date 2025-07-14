import { Country, CustomerAddress } from "@/generated/types";
import styles from "../../checkout/styles/style.module.scss";
import React, { useMemo, useState } from "react";
import SiteSheet from "@/components/reusable-uis/SiteSheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AddressForm, {
  AddressFormValues,
} from "@/components/address/AddressForm";
import { useCountryCodes } from "@/lib/countryCodes";
import useAuth from "../hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  deleteCustomerAddressesStore,
  updateCustomerAddress,
} from "../slice/auth";
import CircularProgress from "@/components/icons/CircularProgress";

type CustomerAddressMainCardProps = {
  address: CustomerAddress;
};
function CustomerAddressMainCard({ address }: CustomerAddressMainCardProps) {
  // hooks
  const { countries, emirates } = useCountryCodes();
  const {
    updateCustomerAddress: [
      updateCustomerAddressCall,
      updateCustomerAddressStatus,
    ],
    deleteCustomerAddress: [deleteCustomerAddress, deleteCustomerAddressStatus],
  } = useAuth();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const winWidth = useAppSelector((state) => state.window.windDim.width);

  //   computed
  const customerAddressEditFields = useMemo(() => {
    const inputFieldTobeEdited = {
      ...address,
    };

    // delete inputFieldTobeEdited.telephone;
    delete inputFieldTobeEdited.region;

    return inputFieldTobeEdited;
  }, [address]);

  // states
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  //   features
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
    // console.log("address field on card", region_id);

    updateCustomerAddressCall({
      variables: {
        id: address.id as number,
        input: {
          ...updateFields,
          region: {
            region: selectedRegion?.name,
            region_code: selectedRegion?.code,
            region_id: parseInt(selectedRegion?.id || "1"),
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
  const onRemoveCustomerAddress = () => {
    if (address.id) {
      deleteCustomerAddress({
        variables: {
          id: address.id,
        },
        onCompleted(data, clientOptions) {
          if (data.deleteCustomerAddress) {
            dispatch(deleteCustomerAddressesStore(address.id as number));
          }
        },
      });
    }
  };

  return (
    <>
      <div className={`address_main_card ${styles.address_card}`}>
        <div>
          <div className="name_phone">
            <span className="name">
              {address.firstname}&nbsp;{address.lastname}
            </span>
          </div>
          <address>
            <span className="phone">+{address.telephone}</span>
            <br />
            <br />
            <p>
              {address.street?.[0]}&nbsp;{address.street?.[1]},&nbsp;
              {address.city}
              ,&nbsp;
              {address.region?.region}
            </p>
            <p>{selectedCountry?.full_name_english} </p>

            <p> {address.postcode ? address.postcode : null}</p>
          </address>
        </div>
        <div className="button_group">
          {/* <button
            className={`selector ${
              isSelected && !isSelecting ? "selected" : ""
            }`}
            onClick={onAddressSelect}
          >
            {isSelecting ? <CircularProgress /> : null}
            {isSelected && !isSelecting ? "selected" : "Select"}
          </button> */}
          <button className="edit_address" onClick={handleOpenSheet}>
            Edit
          </button>
          <button onClick={onRemoveCustomerAddress} className="">
            {deleteCustomerAddressStatus.loading ? <CircularProgress /> : null}
            <span>REMOVE</span>
          </button>
        </div>

        <SiteSheet
          opts={{ open: openAddAddress, onOpenChange: handleOpenSheet }}
          title="Edit Address"
          position="right"
          className={"shipping_address overflow-auto"}
        >
          <div className="form_outer">
            <AddressForm
              isCustomerAddress={true}
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
      </div>
    </>
  );
}

export default CustomerAddressMainCard;
