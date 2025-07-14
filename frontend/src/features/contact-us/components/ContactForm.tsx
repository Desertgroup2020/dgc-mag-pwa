import React, { useState } from "react";
import useMutations from "../hooks/useMutations";
import * as Yup from "yup";
import { useFormik } from "formik";
import { phoneValidRegx } from "@/components/address/useAddressForm";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Input } from "@/components/ui/input";
import { CountryCode } from "@/lib/countryCodes";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Modal from "@/components/reusable-uis/Modal";
import Smile from "@/components/icons/Smile";
import Link from "next/link";
import { CommonEmailRegex } from "@/features/hot/components/HotForm";

function ContactForm() {
  //hooks
  const {
    contactUsMutation: [contactUsMutation, contactUsMutationStatus],
  } = useMutations();
  const { toast } = useToast();

  // constants
  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  };
  // Validation schema
  const validationSchema = Yup.object({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(CommonEmailRegex, "Invalid email")
      .required("Email is required"),
    phone: Yup.string()
      .required("Mobile number is required")
      .matches(phoneValidRegx, "Mobile number is not valid"),
    message: Yup.string().required("Message is required"),
  });
  // useFormik hook initialization
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission here
      const { email, firstname, lastname, message, phone } = values;
      const cleanedNumber = phone.replace(/\+/g, "");

      contactUsMutation({
        variables: {
          email,
          firstName: firstname,
          lastName: lastname,
          message,
          mobile: cleanedNumber,
        },
        onCompleted(data, clientOptions) {
          if (data.createContactUs.success) {
            setOrderCompleted(true);
          }
        },
      });
    },
  });

  // states
  const [mobileNumberCountryCode, setMobileNumberCountryCode] =
    useState<CountryCode>("AE");
  const [orderCompleted, setOrderCompleted] = useState(false);

  //   features
  const handleModalOpen = () => {
    setOrderCompleted((prev) => {
      return !prev;
    });
  };

  return (
    <div className="contact_form">
      <form onSubmit={formik.handleSubmit}>
        <div className="input_grup">
          <label htmlFor="firstname">First Name*</label>
          <Input
            type="text"
            id="firstname"
            {...formik.getFieldProps("firstname")}
            error={!!formik.errors["firstname"] && formik.touched["firstname"]}
            errorTxt={formik.errors["firstname"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="lastname">Last Name*</label>
          <Input
            type="text"
            id="lastname"
            {...formik.getFieldProps("lastname")}
            error={!!formik.errors["lastname"] && formik.touched["lastname"]}
            errorTxt={formik.errors["lastname"]}
          />
        </div>
        <div className="input_grup">
          <label htmlFor="lastname">Email*</label>
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
          <label htmlFor="message">Message*</label>
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
            disabled={contactUsMutationStatus.loading}
          >
            {contactUsMutationStatus.loading ? (
              <LoaderCircle className="animate-spin" />
            ) : null}
            <span>CONTINUE</span>
          </Button>
        </div>
      </form>

      <Modal
        isOpen={orderCompleted}
        setIsOpen={handleModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">THANK YOU FOR YOUR ENQUIRY!</h2>
            <p>WE WILL CONTACT YOU SOON</p>
            <Link href={"/"} className="continue" onClick={handleModalOpen}>
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ContactForm;
