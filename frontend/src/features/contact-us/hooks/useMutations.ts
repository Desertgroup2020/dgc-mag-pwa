import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import CONTACT_US, { ContactUsMutationType } from "../apollo/mutations";
import MAKE_ENQUIRY_MUTATION, { MakeEnquiryType } from "@/features/cms-pages/apollo/mutations";

function useMutations() {
  const errorHandler = useErrorHandler();

  const contactUsMutation = useMutation<
    ContactUsMutationType["Response"],
    ContactUsMutationType["Variables"]
  >(CONTACT_US, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const makeEnquiryMutation = useMutation<
  MakeEnquiryType["Response"],
  MakeEnquiryType["Variables"]
>(MAKE_ENQUIRY_MUTATION, {
  onCompleted(data, clientOptions) {},
  onError: errorHandler,
});

  return {
    contactUsMutation,
    makeEnquiryMutation
  };
}

export default useMutations;
