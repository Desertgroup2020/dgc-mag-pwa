import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import { UNSUBSCRIBE_PRODUCT, UnsubscribeProductType } from "../apollo/mutations";

function useMutations() {
  const errorHandler = useErrorHandler();

  const productUnsubscribe = useMutation<
    UnsubscribeProductType["Response"],
    UnsubscribeProductType["Variables"]
  >(UNSUBSCRIBE_PRODUCT, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    productUnsubscribe
  };
}

export default useMutations;
