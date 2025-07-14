import React, { useState } from "react";
import styles from "../styles/style.module.scss";
import { Input } from "@/components/ui/input";
import * as Yup from "yup";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import useDynamic from "@/features/dynamic-url/hooks/useDynamic";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { CountryCode } from "@/lib/countryCodes";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import Modal from "@/components/reusable-uis/Modal";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import { CommonEmailRegex } from "@/features/hot/components/HotForm";

// Validation Schema using Yup
const validationSchema = Yup.object({
  customer_name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(CommonEmailRegex, "Invalid email")
    .required("Email is required"),
  //need to change accordingly
  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(phoneValidRegx, "Mobile number is not valid"),
  // .test("validate-mobile", "", validateMobile),
  quantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  message: Yup.string().required("Message is required"),
});

function BulkOrderRequestForm({
  productId,
  close,
}: {
  productId: number;
  close: () => void;
}) {
  // hooks
  const { toast } = useToast();
  const {
    requestBulkOrder: [requestBulkOrder, requestBulkOrderStatus],
  } = useDynamic();

  const formik = useFormik({
    initialValues: {
      customer_name: "",
      email: "",
      mobile: "",
      quantity: "",
      message: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { customer_name, email, message, mobile, quantity } = values;
      requestBulkOrder({
        variables: {
          customer_name,
          email,
          message,
          mobile,
          product_id: productId,
          quantity: parseInt(quantity),
        },
        onCompleted(data, clientOptions) {
          if (data.createBulkOrder.success) {
            handleSubmitedSuccess();
          } else {
            toast({
              variant: "error",
              title: "Bulk order",
              description: data.createBulkOrder.message,
            });
          }
        },
      });
    },
  });

  // states
  const [submitedSuccess, setSubmitedSuccess] = useState(false);
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");

  //   features
  const handleSubmitedSuccess = () => {
    setSubmitedSuccess((prev) => {
      if (prev) {
        close();
      }
      return !prev;
    });
  };

  // console.log("formki errors", formik.errors);

  return (
    <div className={`bulk_order_request ${styles.bulk_order_request}`}>
      {!submitedSuccess ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="input_grup">
            <label htmlFor="customer_name">Name*</label>
            <Input
              type="text"
              name="customer_name"
              placeholder="Name.."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.customer_name}
              error={
                !!formik.errors.customer_name && !!formik.touched.customer_name
              }
              errorTxt={formik.errors.customer_name}
            />
          </div>
          <div className="input_grup">
            <label htmlFor="email">Email*</label>
            <Input
              type="email"
              name="email"
              placeholder="example@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={!!formik.errors.email && !!formik.touched.email}
              errorTxt={formik.errors.email}
            />
          </div>
          <div className="input_grup">
            <label htmlFor="mobile">Mobile No. *</label>
            <div className="phone_wrap">
              <div className="code">
                {"+" + getCountryCallingCode(mobileNumberCountryCode)}
              </div>
              <PhoneInput
                name="mobile"
                defaultCountry={mobileNumberCountryCode}
                placeholder="Mobile number"
                value={formik.values["mobile"]}
                onChange={(value) => {
                  formik.setFieldValue("mobile", value || "").then(() => {
                    formik.validateForm();
                  });
                }}
                onCountryChange={(country) => {
                  if (country) {
                    setMobileNumberCountryCode(country);
                  }
                }}
                onBlur={formik.handleBlur}
                // international={false}
                // countryCallingCodeEditable={false}
              />
              {/* {formik.values["mobile"] ? (
              <OtpButton
                isOtpVerified={isOtpVerified}
                requestOtp={requestOtp}
                requestOtpCustomerStatus={requestOtpCustomerStatus}
                formikErrors={formik.errors}
              />
            ) : null} */}

              {formik.errors["mobile"] && formik.touched["mobile"] ? (
                <div className="error">
                  <p>{formik.errors["mobile"]}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="input_grup">
            <label htmlFor="quantity">Quantity*</label>
            <Input
              type="number"
              name="quantity"
              placeholder="50"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
              error={!!formik.errors.quantity && !!formik.touched.quantity}
              errorTxt={formik.errors.quantity}
            />
          </div>
          <div className="input_grup">
            <label htmlFor="message">Message*</label>
            <textarea
              name="message"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
            ></textarea>
            {formik.errors.message && formik.touched.message && (
              <div className="error">{formik.errors.message}</div>
            )}
          </div>
          <div className="input_grup">
            <Button
              type="submit"
              variant={"itself"}
              className="w-full submit_btn text-pcard_price normal_btn"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              disabled={requestBulkOrderStatus.loading}
            >
              {requestBulkOrderStatus.loading ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              <span>MAKE AN ENQUIRY</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">THANK YOU FOR YOUR ENQUIRY!</h2>
            <p>WE WILL CONTACT YOU SOON</p>
            <Link href={"/"} onClick={(e)=> {
              e.preventDefault();
              close();
            }} className="continue">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default BulkOrderRequestForm;
