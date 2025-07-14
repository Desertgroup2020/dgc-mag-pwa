import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import UPDATE_CUSTOMER, {
  UpdateCustomerType,
} from "../apollo/mutations/updateCustomer";

function useMutations() {
  const errorHandler = useErrorHandler();

  const updateCustomer = useMutation<
    UpdateCustomerType["Response"],
    UpdateCustomerType["Variables"]
  >(UPDATE_CUSTOMER, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    updateCustomer
  };
}

export default useMutations;
