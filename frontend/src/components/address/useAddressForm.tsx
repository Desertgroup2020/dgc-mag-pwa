import {
  BillingCartAddress,
  CountryCodeEnum,
  CustomerAddress,
  ShippingCartAddress,
} from "@/generated/types";
import React, { useMemo } from "react";
import * as Yup from "yup";
import { AddressFormValues } from "./AddressForm";
import { parsePhoneNumber } from "react-phone-number-input";

export const phoneValidRegx: RegExp =
  /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

type UseAddressFormType = {
  editAddress?: AddressFormValues;
};
function useAddressForm({ editAddress }: UseAddressFormType) {
  const addressValidationSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    country_code: Yup.string().required("Country code is required"),
    region: Yup.string().required("Region is required"),
    street: Yup.array().of(Yup.string()).min(1, "Street address is required"),
    buildingName: Yup.string().optional(),
    city: Yup.string().required("City is required"),
    postcode: Yup.string().optional(),
    telephone: Yup.string()
      .required("Telephone is required")
      .matches(phoneValidRegx, "Telephone number is not valid"),
  });

  const initialValues = useMemo(
    () => ({
      firstname: editAddress?.firstname || "",
      lastname: editAddress?.lastname || "",
      company: editAddress?.company || "",
      country_code: editAddress?.country_code || CountryCodeEnum.Ae,
      region: editAddress?.region || "",
      buildingName:
        editAddress && editAddress?.street.length > 2
          ? editAddress?.street?.[0]
          : "",
      street: editAddress?.street
        ? editAddress?.street?.length < 3
          ? editAddress?.street
          : [editAddress?.street?.[1], editAddress?.street?.[2]]
        : [],
      city: editAddress?.city || "",
      postcode: editAddress?.postcode || "",
      telephone:
        (editAddress?.telephone &&
          parsePhoneNumber(`+${editAddress?.telephone}`)?.number) ||
        "",
      save_in_address_book: true,
      default_billing: editAddress?.default_billing || false,
      default_shipping: editAddress?.default_shipping || false,
    }),
    [editAddress]
  );

  return { addressValidationSchema, initialValues };
}

export default useAddressForm;
