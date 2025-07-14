import { useToast } from "@/components/ui/use-toast";
import useMutations from "@/features/contact-us/hooks/useMutations";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountryCode } from "@/lib/countryCodes";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import styles from "../styles/style.module.scss";

type EnquiryFormProps = {
  handleCompleteEnquiry: () => void;
};
function EnquiryForm() {
  //hooks
  const {
    makeEnquiryMutation: [makeEnquiryMutation, makeEnquiryMutationStatus],
  } = useMutations();
  const { toast } = useToast();

  // constants
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
  };
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Mobile number is required")
      .matches(phoneValidRegx, "Mobile number is not valid"),
    message: Yup.string().required("Message is required"),
  });

  //   states
  const [madeEnquiry, setMadeEnquiry] = useState(false);
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      const { email, name, message, phone } = values;
      const cleanedNumber = phone.replace(/\+/g, "");

      makeEnquiryMutation({
        variables: {
          email,
          name,
          message,
          mobile: cleanedNumber,
        },
        onCompleted(data, clientOptions) {
          if (data.createAboutUs.success) {
            setMadeEnquiry(true);
          }
        },
      });
    },
  });

  //   effects
  useEffect(() => {
    () => {
      setMadeEnquiry(false);
    };
  }, []);

  return (
    <div className={`enquiry_form ${styles.enquiry_form}`}>
      {!madeEnquiry ? (
        <div className="form_wrap">
          <h2 className="text-h2">Make an Enquiry</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="input_grup">
              <label htmlFor="name">Name </label>
              <Input
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                error={!!formik.errors["name"] && formik.touched["name"]}
                errorTxt={formik.errors["name"]}
              />
            </div>
            <div className="input_grup">
              <label htmlFor="lastname">Email </label>
              <Input
                type="text"
                id="email"
                {...formik.getFieldProps("email")}
                error={!!formik.errors["email"] && formik.touched["email"]}
                errorTxt={formik.errors["email"]}
              />
            </div>
            <div className="input_grup">
              <label htmlFor="mobile">Mobile No. *</label>
              <div className="phone_wrap">
                <div className="code">
                  {"+" + getCountryCallingCode(mobileNumberCountryCode)}
                </div>
                <PhoneInput
                  name="phone"
                  defaultCountry={mobileNumberCountryCode}
                  placeholder="Mobile number"
                  value={formik.values["phone"]}
                  onChange={(value) => {
                    formik.setFieldValue("phone", value || "").then(() => {
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

                {formik.errors["phone"] && formik.touched["phone"] ? (
                  <div className="error">
                    <p>{formik.errors["phone"]}</p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="input_grup">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                value={formik.values.message}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
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
                disabled={makeEnquiryMutationStatus.loading}
              >
                {makeEnquiryMutationStatus.loading ? (
                  <LoaderCircle className="animate-spin" />
                ) : null}
                <span>CONTINUE</span>
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">THANK YOU FOR YOUR ENQUIRY!</h2>
            <p>WE WILL CONTACT YOU SOON</p>
            <Link href={"/"} className="continue">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnquiryForm;
