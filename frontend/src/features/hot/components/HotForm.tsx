import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import PhoneInputWithCountrySelect, {
  getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryCode } from "@/lib/countryCodes";
import ProductTypeSelectBox from "./ProductTypeSelectBox";
import useHot from "../hooks/useHot";

export const CommonEmailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export type HotFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  furnitureType: string;
  size: string;
  material: string;
  color: string;
  // door_type: string;
  message: string;
};
type HotFormProps = {
  onSubmit: (values: HotFormValues) => void;
  isSubmiting: boolean;
};
function HotForm({ isSubmiting, onSubmit }: HotFormProps) {
  // refs
  const phoneInputRef = useRef<any>(null);
  // hooks
  const { productTypes } = useHot();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      furnitureType: "",
      message: "",
      size: "",
      material: "",
      color: "",
      // door_type: "Indoor", // Default selection
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .matches(CommonEmailRegex, "Invalid email format")
        .required("Email is required"),
      mobile: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .required("Mobile number is required"),
      furnitureType: Yup.string().required("Furniture type is required"),
      size: Yup.string().optional(),
      material: Yup.string().optional(),
      color: Yup.string().optional(),
      // door_type: Yup.string()
      //   .oneOf(["Indoor", "Outdoor"], "Invalid door type")
      //   .optional(),
      message: Yup.string(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  //   states
  const [currentCountryCode, setCurrentCountryCode] =
    useState<CountryCode>("AE");

  // features
  const handleProductTypeSelect = (productType: string) => {
    if (formik.values.furnitureType !== productType) {
      formik.setFieldValue("furnitureType", productType).then(() => {
        formik.handleChange({
          target: { name: "furnitureType", value: productType },
        });
      });
    }
  };

  // effects
  useEffect(() => {
    if (productTypes.length) {
      handleProductTypeSelect(productTypes?.[0]);
    }
  }, []);
  // console.log("hot form values", formik.values);

  return (
    <div className="hot_form">
      <form onSubmit={formik.handleSubmit}>
        <div className="input_grup">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="error">{formik.errors.firstName}</div>
          )}
        </div>

        <div className="input_grup">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="error">{formik.errors.lastName}</div>
          )}
        </div>

        <div className="input_grup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email}</div>
          )}
        </div>

        {/* <div className="input_grup">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            name="mobile"
            id="mobile"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mobile}
          />
          {formik.touched.mobile && formik.errors.mobile && (
            <div className="error">{formik.errors.mobile}</div>
          )}
        </div> */}
        <div className="input_grup">
          <label htmlFor="mobile">Mobile*</label>
          <div className="phone_wrap">
            <div className="code">
              {"+" + getCountryCallingCode(currentCountryCode)}
            </div>
            <PhoneInputWithCountrySelect
              ref={phoneInputRef}
              name="mobile"
              defaultCountry={currentCountryCode}
              placeholder="Mobile number"
              value={formik.values["mobile"]!}
              onChange={(value) => {
                formik.setFieldValue("mobile", value || "").then(() => {
                  formik.validateForm();
                });
              }}
              onCountryChange={(country) => {
                if (country) setCurrentCountryCode(country);
              }}
              onBlur={formik.handleBlur}
              international={false}
            />
            {formik.values["mobile"]
              ? // <OtpButton
                //   isOtpVerified={isOtpVerified}
                //   requestOtp={requestOtp}
                //   requestOtpCustomerStatus={requestOtpCustomerStatus}
                //   registrationFormErrors={registrationForm.errors}
                // />
                null
              : null}

            {formik.errors["mobile"] && formik.touched["mobile"] ? (
              <div className="error">
                <p>{formik.errors["mobile"]}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="input_grup">
          <label htmlFor="furnitureType">Product type</label>
          <ProductTypeSelectBox onSelectProductType={handleProductTypeSelect} />
          {formik.errors["furnitureType"] && formik.touched["furnitureType"] ? (
            <div className="error">
              <p>{formik.errors["furnitureType"]}</p>
            </div>
          ) : null}
        </div>

        {/* Door Type */}
        {/* <div className="input_grup">
          <label>Door Type</label>
          <div className="radio_wrap">
            <label>
              <Input
                type="radio"
                name="door_type"
                value="Indoor"
                checked={formik.values.door_type === "Indoor"}
                onChange={formik.handleChange}
              />
              <span>Indoor</span>
            </label>
            <label>
              <Input
                type="radio"
                name="door_type"
                value="Outdoor"
                checked={formik.values.door_type === "Outdoor"}
                onChange={formik.handleChange}
              />
              <span>Outdoor</span>
            </label>
          </div>
          {formik.touched.door_type && formik.errors.door_type && (
            <div className="error">{formik.errors.door_type}</div>
          )}
        </div> */}

        <div className="input_grup">
          <label htmlFor="size">Size</label>
          <input
            type="text"
            name="size"
            id="size"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.size}
          />
          {formik.touched.size && formik.errors.size && (
            <div className="error">{formik.errors.size}</div>
          )}
        </div>

        {/* Material */}
        <div className="input_grup">
          <label htmlFor="material">Material</label>
          <Input
            type="text"
            name="material"
            id="material"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.material}
          />
          {formik.touched.material && formik.errors.material && (
            <div className="error">{formik.errors.material}</div>
          )}
        </div>

        {/* Color */}
        <div className="input_grup">
          <label htmlFor="color">Color</label>
          <Input
            type="text"
            name="color"
            id="color"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.color}
          />
          {formik.touched.color && formik.errors.color && (
            <div className="error">{formik.errors.color}</div>
          )}
        </div>

        <div className="input_grup">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
          />
          {formik.touched.message && formik.errors.message && (
            <div className="error">{formik.errors.message}</div>
          )}
        </div>

        <div className="input_grup">
          <Button
            type="submit"
            variant={"itself"}
            className="w-full submit_btn text-pcard_price normal_btn"
            disabled={isSubmiting}
          >
            {isSubmiting ? <LoaderCircle className="animate-spin" /> : null}
            <span>SUBMIT</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default HotForm;
