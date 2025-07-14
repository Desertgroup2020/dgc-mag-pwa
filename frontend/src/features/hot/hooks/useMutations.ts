import { useErrorHandler } from "@/utils";
import { useMutation } from "@apollo/client";
import React from "react";
import CREATE_HOT_REQUEST, { CreateHotRequestType } from "../apollo/mutations";

function useMutations() {
  const errorHandler = useErrorHandler();

  const createHotRequest = useMutation<
    CreateHotRequestType["Response"],
    CreateHotRequestType["Variables"]
  >(CREATE_HOT_REQUEST, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    createHotRequest
  };
}

export default useMutations;
