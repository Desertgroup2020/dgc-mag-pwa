import * as Yup from "yup";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import useMutations from "../hooks/useMutations";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateCustomer } from "@/features/authentication/slice/auth";
import CircularProgress from "@/components/icons/CircularProgress";
import { Customer } from "@/generated/types";
import { useToast } from "@/components/ui/use-toast";

function GeneralInfo() {
  // hooks
  // const { customerFirstName, customerLastName } = useCustomer();
  const customer = useAppSelector((state) => state.auth.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    updateCustomer: [updateCustomerCall, updateCustomerStatus],
  } = useMutations();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // computed
  const customerFirstName = useMemo(() => customer?.firstname, [customer]);
  const customerLastName = useMemo(() => customer?.lastname, [customer]);

  // constants
  const initialValues = useMemo(
    () => ({
      firstname: customerFirstName || "",
      lastname: customerLastName || "",
    }),
    [customerFirstName, customerLastName]
  );
  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(3, "Name is too short")
      .max(60, "Name is too long")
      .required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
  });

  //   states
  const generalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit(values, formikHelpers) {
      if (values.firstname && values.lastname) {
        updateCustomerCall({
          variables: {
            input: {
              firstname: values.firstname,
              lastname: values.lastname,
            },
          },
          onCompleted(data, clientOptions) {
            if (data.updateCustomerV2.customer) {
              dispatch(updateCustomer(data.updateCustomerV2.customer));
              toast({
                title: "Update customer",
                description: "Updated Successfully",
                variant: "success",
              });
            }
          },
        });
      }
    },
  });
  const [disableEdit, setDisableEdit] = useState(true);

  //   effects
  useEffect(() => {
    if (!disableEdit) {
      setTimeout(() => {
        inputRef.current?.focus(); // Focus after disableEdit becomes false
      }, 100);
    }
  }, [disableEdit]);

  useEffect(() => {
    if (customer?.firstname && customer.lastname) {
      generalFormik.setFieldValue("firstname", customer.firstname);
      generalFormik.setFieldValue("lastname", customer.lastname);
    }
  }, [customer]);
  //   logs
  // console.log("logs", generalFormik.values.firstname);

  return (
    <div className="general_info nameings">
      <h2 className="text-h3">General Info</h2>
      <div className="info_area">
        <div className="inputs">
          <div className="input_grup">
            <label htmlFor="firstname">First Name</label>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter your first name..."
              {...generalFormik.getFieldProps("firstname")}
              error={
                !!generalFormik.errors["firstname"] &&
                generalFormik.touched["firstname"]
              }
              errorTxt={generalFormik.errors["firstname"]}
              disabled={disableEdit}
            />
          </div>
          <div className="input_grup">
            <label htmlFor="lastname">Last Name</label>
            <Input
              type="text"
              placeholder="Enter your last name..."
              {...generalFormik.getFieldProps("lastname")}
              error={
                !!generalFormik.errors["lastname"] &&
                generalFormik.touched["lastname"]
              }
              errorTxt={generalFormik.errors["lastname"]}
              disabled={disableEdit}
            />
          </div>
        </div>
        <div className="btns">
          <Button
            variant={"action_green"}
            type={!disableEdit ? "submit" : "button"}
            className="btn_action_green_rounded"
            onClick={(e) => {
              e.preventDefault();
              if (!disableEdit) {
                generalFormik.submitForm();
              } else {
                setDisableEdit(false);
              }
            }}
          >
            {updateCustomerStatus.loading ? (
              <span>
                <CircularProgress />
              </span>
            ) : (
              <BtnRightArrow />
            )}

            <span>{disableEdit ? "UPDATE INFO" : "UPDATE"}</span>
          </Button>
          {!disableEdit ? (
            <Button
              variant={"action_green"}
              type="button"
              onClick={() => {
                generalFormik.setValues({
                  firstname: customerFirstName || "",
                  lastname: customerLastName || "",
                }); // Reset to latest customer values
                setDisableEdit(true);
              }}
              className="btn_action_green_rounded"
            >
              <BtnRightArrow />
              <span>CANCEL</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GeneralInfo;
