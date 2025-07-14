"use client";

import {
  Address,
  CartAddressInput,
  Country,
  CustomerAddressInput,
  Emirates,
  Region,
} from "@/generated/types";
import { useFormik } from "formik";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import useAddressForm from "./useAddressForm";
import PhoneInputWithCountrySelect, {
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import OtpButton from "@/features/authentication/components/RenderOtpBtns";
import CountrySelectBox from "../form-components/CountrySelectBox";
// import { Country } from "@/lib/utils";
import { CountryCode, useCountryCodes } from "@/lib/countryCodes";
import styles from "./style.module.scss";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import RegionSelectBox from "../form-components/RegionSelectSearch";
import { LoaderCircle } from "lucide-react";
import { GetLocationFromCoordsType } from "../map/apollo/queries";
import MapComponent from "../map/MapComponent";
import { useToast } from "../ui/use-toast";
import EmiratesSelectBox from "../form-components/EmiratesSelectBox";

// const MapComponent = dynamic(() => import("../map/MapComponent"), {
//   ssr: false,
// });
export type AddressFormValues = CartAddressInput &
  CustomerAddressInput & { buildingName?: string };

type AddressFormProps = {
  onSubmit: ({
    addressFields,
    coords,
  }: {
    addressFields: AddressFormValues;
    coords: google.maps.LatLngLiteral | null;
    region_id?: number | null;
  }) => void;
  isCustomerAddress: boolean;
  isSubmiting: boolean;
  editAddress?: AddressFormValues;
};

function AddressForm({
  onSubmit,
  editAddress,
  isCustomerAddress,
  isSubmiting,
}: AddressFormProps) {
  // refs
  const phoneInputRef = useRef<any>(null);

  // hooks
  const { addressValidationSchema, initialValues } = useAddressForm({
    editAddress,
  });
  const { countries, emirates } = useCountryCodes();
  const addressForm = useFormik<AddressFormValues>({
    initialValues: initialValues as any,
    validationSchema: addressValidationSchema,
    onSubmit(values, formikHelpers) {
      const buildingName = values.buildingName;
      // Clone the street array to avoid mutating the original
      const newStreet = [...values.street];

      if (buildingName) {
        // Insert the buildingName at index 0 and shift the other elements
        if (newStreet.length < 3) {
          newStreet.splice(0, 0, buildingName);
        } else {
          newStreet.splice(0, 1, buildingName);
        }
      } else {
        if (newStreet.length < 3) {
          newStreet.splice(0, 0, "");
        } else {
          newStreet.splice(0, 1, "");
        }
      }

      // Ensure the street array length matches the original
      const updatedStreet = newStreet.slice(0, values.street.length);

      // Update the values object with the modified street array
      const newValues = {
        ...values,
        street: newStreet,
      };

      delete newValues.buildingName;

      onSubmit({
        addressFields: newValues,
        coords: mapCoords,
        region_id: currentRegion?.id as any,
      });
    },
  });
  const { toast } = useToast();

  // computed
  // const addressCoords = React.useMemo(() => {
  //   if (editAddress?.custom_attributesV2?.length) {
  //     return {
  //       lat: parseFloat(editAddress.custom_attributesV2?.[0]?.value || ""),
  //       lng: parseFloat(editAddress.custom_attributesV2?.[1]?.value || ""),
  //     };
  //   }
  //   return null;
  // }, [editAddress?.custom_attributesV2]);

  // states
  const [currentCountryCode, setCurrentCountryCode] = useState<CountryCode>(
    (editAddress?.country_code as CountryCode) || "AE"
  );
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [getingLocation, setGetingLocation] = useState(false);
  const [regionIdFromLocation, setRegionIdFromLocation] = useState<
    null | number
  >(null);
  const [mapCoords, setMapCoords] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [addressCoords, setAddressCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // features
  const handleCountrySelect = useCallback(
    (country: Country) => {
      if (addressForm.values.country_code !== country.id) {
        addressForm.setFieldValue("country_code", country.id);
        setCurrentCountryCode(country.id as CountryCode);

        // if (phoneInputRef.current) {
        //   phoneInputRef.current.selectCountry(country.id);
        // }
      }
    },
    [addressForm]
  );
  const handleRegionSelect = useCallback(
    (region: Region) => {
      // console.log("selected Region", region);
      setCurrentRegion(region);
      if (addressForm.values.region !== region.name) {
        addressForm.setFieldValue("region", region.name).then(() => {
          addressForm.handleChange({
            target: { name: "region", value: region.name },
          });
        });
      }
    },
    [addressForm]
  );
  const onSelectEmirates = useCallback(
    (emirate: Emirates, regionId: any) => {
      console.log("selecting emirates", emirates);
      console.log("trageting region id", regionId);

      if (emirate.region?.length) {
        const currentRegion = emirate.region.find(
          (region) => region?.id == regionId
        );
        setRegions(emirate.region as Region[]);

        if (currentRegion) handleRegionSelect(currentRegion);
      }
    },
    [handleRegionSelect]
  );
  const fillAddressFields = useCallback(
    ({ address }: { address: Address }) => {
      const { city, country, postcode, state, street } = address;

      // console.log("address from map", address);

      if (postcode) {
        addressForm.setFieldValue("postcode", postcode).then(() => {
          addressForm.handleChange({
            target: { name: "postcode", value: postcode },
          });
        });
      }
      if (city) {
        addressForm.setFieldValue("city", city).then(() => {
          addressForm.handleChange({
            target: { name: "city", value: city },
          });
        });
      }
      if (street) {
        const [streetPart1, streetPart2, streetPart3] = street
          .split(",")
          .map((part) => part.trim());

        addressForm.setFieldValue("street[0]", streetPart1).then(() => {
          addressForm.handleChange({
            target: { name: "street[0]", value: streetPart1 },
          });
        });

        if (streetPart2) {
          addressForm.setFieldValue("street[1]", streetPart2).then(() => {
            addressForm.handleChange({
              target: {
                name: "street[1]",
                value: `${streetPart2}, ${streetPart3}`,
              },
            });
          });
        }
      }
      if (state) {
        // console.log("available regions", regions);
        console.log("region from map", state);
        console.log("emirates", emirates);

        const regionHeldEmirate = emirates.find(
          (emirate) => emirate.name?.toLowerCase() === state.toLowerCase()
        );
        const selectedRegion =
          regionHeldEmirate?.region?.find(
            (region) => region?.name?.toLowerCase() === state.toLowerCase()
          ) || regionHeldEmirate?.region?.[0];

        console.log("selected region", selectedRegion);
        console.log("region held emirates", regionHeldEmirate);

        if (regionHeldEmirate && selectedRegion) {
          onSelectEmirates(regionHeldEmirate, selectedRegion.id);
          setRegionIdFromLocation(selectedRegion.id as any);
        }
      }
    },
    [addressForm, emirates, onSelectEmirates]
  );
  const onGetingLocation = (
    locationDetails: GetLocationFromCoordsType["Response"],
    coords: google.maps.LatLngLiteral | null
  ) => {
    if (locationDetails.getAddress.length) {
      if (locationDetails.getAddress?.[0].country === "United Arab Emirates") {
        fillAddressFields({ address: locationDetails.getAddress?.[0] });
        if (coords?.lat && coords.lng) {
          setMapCoords(coords);
        }
      } else {
        toast({
          variant: "warning",
          description: "Service is only applicable for United Arab Emirates",
          title: "Warning!",
          duration: 5000,
        });
      }
    }
  };
  const onErrorGetingLocation = (errMsg: string) => {
    // console.log("location error", errMsg);
  };

  // effects
  useEffect(() => {
    if (countries.length) {
      const defaultCountry = countries.find(
        (country) =>
          country.id === editAddress?.country_code || country.id === "AE"
      );

      if (defaultCountry) setCurrentCountry(defaultCountry);
    }
  }, [countries, editAddress]);

  useEffect(() => {
    // console.log("is it overidding");

    if (emirates.length && !editAddress?.region_id) {
      onSelectEmirates(emirates?.[0], emirates?.[0].region?.[0]?.id as string);
    }
  }, [emirates, editAddress]);

  useLayoutEffect(() => {
    if (editAddress?.telephone) {
      const parsedMobile = parsePhoneNumber(`+${editAddress?.telephone}`);

      // console.log("edit address mobile code", parsedMobile);
      if (parsedMobile?.country && phoneInputRef.current) {
        setCurrentCountryCode((parsedMobile?.country as CountryCode) || "AE");
        // console.log("phone input", phoneInputRef.current);

        // phoneInputRef.current?.selectCountry(parsedMobile?.country || "AE");
      }
    }

    if (editAddress?.region_id) {
      const currentEmirates = emirates.find((emirate) =>
        emirate.region?.find((region) => region?.id == editAddress?.region_id)
      );

      if (currentEmirates?.region?.length) {
        onSelectEmirates(currentEmirates, editAddress?.region_id as any);
        setRegionIdFromLocation(editAddress?.region_id as any);
      }
    }

    if (editAddress?.custom_attributesV2?.length) {
      setAddressCoords({
        lat: parseFloat(editAddress.custom_attributesV2?.[0]?.value || ""),
        lng: parseFloat(editAddress.custom_attributesV2?.[1]?.value || ""),
      });
    }
  }, [editAddress]);

  // console.log("current region", currentRegion);
  // console.log("regions", regions);
  // console.log("edit form values", editAddress);

  return (
    <div className={`address_form ${styles.address_form}`}>
      <div className="map_wraper">
        <MapComponent
          onGetingLocation={onGetingLocation}
          onError={onErrorGetingLocation}
          setGetingLocation={setGetingLocation}
          addressCoords={addressCoords}
        />
      </div>
      <form onSubmit={addressForm.handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="input_grup">
              <label htmlFor="firstname">First name*</label>
              <Input
                type="text"
                name="firstname"
                value={addressForm.values.firstname}
                onChange={addressForm.handleChange}
                onBlur={addressForm.handleBlur}
                placeholder="Ashford"
                error={
                  !!addressForm.errors["firstname"] &&
                  addressForm.touched["firstname"]
                }
                errorTxt={addressForm.errors["firstname"]}
              />
            </div>
          </div>
          <div className="col">
            <div className="input_grup">
              <label htmlFor="lastname">Last name*</label>
              <Input
                type="text"
                name="lastname"
                value={addressForm.values.lastname}
                onChange={addressForm.handleChange}
                onBlur={addressForm.handleBlur}
                placeholder="Smith"
                error={
                  !!addressForm.errors["lastname"] &&
                  addressForm.touched["lastname"]
                }
                errorTxt={addressForm.errors["lastname"]}
              />
            </div>
          </div>
        </div>

        <div className="input_grup">
          <label htmlFor="company">Company</label>
          <Input
            type="text"
            name="company"
            value={addressForm.values.company || ""}
            onChange={addressForm.handleChange}
            placeholder="Company Name (Optional)"
          />
        </div>

        <div className="input_grup">
          <label htmlFor="country_code">Country / Region*</label>
          <CountrySelectBox
            defaultCountryCode={currentCountryCode || "AE"}
            // defaultCountryCode={currentCountryCode}
            name="country_code"
            onSelectCountry={handleCountrySelect}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="emirate">Emirates*</label>
          <EmiratesSelectBox
            onSelectEmirate={onSelectEmirates}
            regionId={currentRegion?.id as any}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="region">Region*</label>
          {regions?.length ? (
            <RegionSelectBox
              name="region"
              regions={regions}
              onSelectRegion={handleRegionSelect}
              regionId={(currentRegion?.id as any) || null}
            />
          ) : null}
        </div>
        <div className="input_grup">
          <label htmlFor="buildingName">Building Name</label>
          <Input
            type="text"
            name="buildingName"
            value={addressForm.values.buildingName || ""}
            onChange={addressForm.handleChange}
            onBlur={addressForm.handleBlur}
            error={
              !!addressForm.errors.buildingName &&
              !!addressForm.touched.buildingName
            }
            errorTxt={addressForm.errors.buildingName}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="street">Street Address*</label>
          <Input
            type="text"
            name="street[0]"
            value={addressForm.values.street[0]!}
            onChange={addressForm.handleChange}
            onBlur={addressForm.handleBlur}
            error={
              !!addressForm.errors["street"] && addressForm.touched["street"]
            }
            errorTxt={addressForm.errors["street"] as string}
          />
        </div>
        <div className="input_grup">
          <Input
            type="text"
            name="street[1]"
            value={addressForm.values.street[1]!}
            onChange={addressForm.handleChange}
            onBlur={addressForm.handleBlur}
            // error={
            //   !!addressForm.errors["street"] && addressForm.touched["street"]
            // }
            // errorTxt={addressForm.errors["street"] as string}
          />
        </div>
        <div className="row">
          <div className="col">
            <div className="input_grup">
              <label htmlFor="city">City*</label>
              <Input
                type="text"
                name="city"
                value={addressForm.values.city}
                onChange={addressForm.handleChange}
                onBlur={addressForm.handleBlur}
                error={
                  !!addressForm.errors["city"] && addressForm.touched["city"]
                }
                errorTxt={addressForm.errors["city"]}
              />
            </div>
          </div>
          <div className="col">
            <div className="input_grup">
              <label htmlFor="postcode">Zip Code</label>
              <Input
                type="text"
                name="postcode"
                value={addressForm.values.postcode!}
                onChange={addressForm.handleChange}
                onBlur={addressForm.handleBlur}
                error={
                  !!addressForm.errors["postcode"] &&
                  addressForm.touched["postcode"]
                }
                errorTxt={addressForm.errors["postcode"]}
              />
            </div>
          </div>
        </div>

        <div className="input_grup">
          <label htmlFor="telephone">Telephone*</label>
          {/* <Input
            type="text"
            name="telephone"
            value={addressForm.values.telephone!}
            onChange={addressForm.handleChange}
            onBlur={addressForm.handleBlur}
            error={
              !!addressForm.errors["telephone"] &&
              addressForm.touched["telephone"]
            }
            errorTxt={addressForm.errors["telephone"]}
          /> */}
          <div className="phone_wrap">
            <div className="code">
              {"+" + getCountryCallingCode(currentCountryCode)}
            </div>
            <PhoneInputWithCountrySelect
              ref={phoneInputRef}
              name="telephone"
              defaultCountry={currentCountryCode}
              placeholder="Mobile number"
              value={addressForm.values["telephone"]!}
              onChange={(value) => {
                addressForm.setFieldValue("telephone", value || "").then(() => {
                  addressForm.validateForm();
                });
              }}
              onCountryChange={(country) => {
                if (country) setCurrentCountryCode(country);
              }}
              onBlur={addressForm.handleBlur}
              international={false}
            />
            {addressForm.values["telephone"]
              ? // <OtpButton
                //   isOtpVerified={isOtpVerified}
                //   requestOtp={requestOtp}
                //   requestOtpCustomerStatus={requestOtpCustomerStatus}
                //   registrationFormErrors={registrationForm.errors}
                // />
                null
              : null}

            {addressForm.errors["telephone"] &&
            addressForm.touched["telephone"] ? (
              <div className="error">
                <p>{addressForm.errors["telephone"]}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Checkbox for default billing */}
        {isCustomerAddress ? (
          <div className="input_grup checkbox">
            <label htmlFor="default_billing">
              <input
                type="checkbox"
                name="default_billing"
                id="default_billing"
                checked={!!addressForm.values.default_billing}
                onChange={addressForm.handleChange}
              />
              <span>Default Billing Address</span>
            </label>
          </div>
        ) : null}

        {/* Checkbox for default shipping */}
        {isCustomerAddress ? (
          <div className="input_grup checkbox">
            <label htmlFor="default_shipping">
              <input
                type="checkbox"
                name="default_shipping"
                id="default_shipping"
                checked={!!addressForm.values.default_shipping}
                onChange={addressForm.handleChange}
              />
              <span>Default Shipping Address</span>
            </label>
          </div>
        ) : null}

        <div className="input_grup">
          <Button
            type="submit"
            variant={"itself"}
            className="w-full submit_btn text-pcard_price normal_btn"
            onSubmit={(e) => {
              e.preventDefault();
              addressForm.handleSubmit();
            }}
            disabled={isSubmiting}
          >
            {isSubmiting ? <LoaderCircle className="animate-spin" /> : null}
            <span>CONTINUE</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
