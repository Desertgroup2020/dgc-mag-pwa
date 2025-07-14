import { SUBSCRIBE_TO_EMAIL_NEWSLETTER } from "@/features/account-section/graphql/auth";
import { SubscribeEmailToNewsletterOutput } from "@/generated/types";
import { useMutation } from "@apollo/client";
import {
  ACCOUNT_OTP_VERIFY,
  AccountOtpVerifyType,
  CREATE_CUSTOMER_ACCOUNT,
  CreateCustomerAccountType,
  GENERATE_CUSTOMER_TOKEN_EMAIL,
  GenerateCustomerTokenEmailType,
  REQUEST_ACCOUNT_OTP,
  REQUEST_OTP_EMAIL_LOGIN,
  REQUEST_OTP_FOR_MOBILE,
  RequestAccountOtpType,
  RequestOtpForEmailLoginType,
  RequestOtpForMobile,
  VERIFY_MOBILE_OTP,
  VerifyMobileOtp,
} from "../apollo/mutations";
import { useErrorHandler } from "@/utils";
import ADD_CUSTOMER_ADDRESS, {
  AddCustomerAddressType,
} from "../apollo/mutations/addCustomerAddress";
import UPDATE_CUSTOMER_ADDRESS, {
  UpdateCustomerAddressType,
} from "../apollo/mutations/updateCustomerAddress";
import UPDATE_CUSTOMER_MOBILE_OTP_REQUEST, {
  UpdateCustomerMobileOtpRequestType,
} from "../apollo/mutations/updateCustomerMobile";
import UPDATE_CUSTOMER_MOBILE_OTP_VERIFY, {
  UpdateCustomerMobileOtpVerifyType,
} from "../apollo/mutations/updateCustomerMobileVerify";
import DELETE_CUSTOMER_ADDRESS, {
  DeleteCustomerAddressType,
} from "../apollo/mutations/deleteCustomerAddress";
import POST_ORDER_FEEDBACK, {
  PostOrderFeedbackType,
} from "../apollo/mutations/orderFeedback";
import ACCOUNT_CONFIRMATION, {
  ConfirmAccountType,
} from "../apollo/mutations/confirmAccount";
import { useToast } from "@/components/ui/use-toast";

function useAuth() {
  const errorHandler = useErrorHandler();
  const { toast } = useToast();

  // user registration
  const createCustomerWithOtp = useMutation<
    CreateCustomerAccountType["Response"],
    CreateCustomerAccountType["Variables"]
  >(CREATE_CUSTOMER_ACCOUNT, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const requestOtpCustomer = useMutation<
    RequestAccountOtpType["Response"],
    RequestAccountOtpType["Variables"]
  >(REQUEST_ACCOUNT_OTP, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const verifyCustomerOtp = useMutation<
    AccountOtpVerifyType["Response"],
    AccountOtpVerifyType["Variables"]
  >(ACCOUNT_OTP_VERIFY, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  // ===
  // email login
  const loginWithEmail = useMutation<
    GenerateCustomerTokenEmailType["Response"],
    GenerateCustomerTokenEmailType["Variables"]
  >(GENERATE_CUSTOMER_TOKEN_EMAIL, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const requestOtpForloginWithEmail = useMutation<
    RequestOtpForEmailLoginType["Response"],
    RequestOtpForEmailLoginType["Variables"]
  >(REQUEST_OTP_EMAIL_LOGIN, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  // ===

  // mobile login
  const requestOtpForMobileLogin = useMutation<
    RequestOtpForMobile["Response"],
    RequestOtpForMobile["Variables"]
  >(REQUEST_OTP_FOR_MOBILE, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const verifyMobileOtp = useMutation<
    VerifyMobileOtp["Response"],
    VerifyMobileOtp["Variables"]
  >(VERIFY_MOBILE_OTP, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  // ===

  const subscribeEmailToNewsletter = useMutation<{
    subscribeEmailToNewsletter: SubscribeEmailToNewsletterOutput;
  }>(SUBSCRIBE_TO_EMAIL_NEWSLETTER, {
    onCompleted: (data) => {
      if (data.subscribeEmailToNewsletter.status) {
        // alert("Subscribed to newsletter");
        // console.log("Subscribed");
        toast({
          variant: "success",
          title: "Newsletter",
          description: `Subscribed to newsletter`,
        });
      }
    },
    // onError: onAuthFailed,
    onError: errorHandler,
  });

  const addCustomerAddress = useMutation<
    AddCustomerAddressType["Response"],
    AddCustomerAddressType["Variables"]
  >(ADD_CUSTOMER_ADDRESS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const updateCustomerAddress = useMutation<
    UpdateCustomerAddressType["Response"],
    UpdateCustomerAddressType["Variables"]
  >(UPDATE_CUSTOMER_ADDRESS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const requestOtpForMobileUpdation = useMutation<
    UpdateCustomerMobileOtpRequestType["Response"],
    UpdateCustomerMobileOtpRequestType["Variables"]
  >(UPDATE_CUSTOMER_MOBILE_OTP_REQUEST, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const verifyOtpForMobileUpdation = useMutation<
    UpdateCustomerMobileOtpVerifyType["Response"],
    UpdateCustomerMobileOtpVerifyType["Variables"]
  >(UPDATE_CUSTOMER_MOBILE_OTP_VERIFY, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  const deleteCustomerAddress = useMutation<
    DeleteCustomerAddressType["Response"],
    DeleteCustomerAddressType["Variables"]
  >(DELETE_CUSTOMER_ADDRESS, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });
  const postOrderFeedback = useMutation<
    PostOrderFeedbackType["Response"],
    PostOrderFeedbackType["Variables"]
  >(POST_ORDER_FEEDBACK, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  // Account confirmation
  const accountConfirmation = useMutation<
    ConfirmAccountType["Response"],
    ConfirmAccountType["Variables"]
  >(ACCOUNT_CONFIRMATION, {
    onCompleted(data, clientOptions) {},
    onError: errorHandler,
  });

  return {
    subscribeEmailToNewsletter,
    createCustomerWithOtp,
    requestOtpCustomer,
    verifyCustomerOtp,
    loginWithEmail,
    requestOtpForloginWithEmail,
    requestOtpForMobileLogin,
    verifyMobileOtp,
    addCustomerAddress,
    updateCustomerAddress,
    requestOtpForMobileUpdation,
    verifyOtpForMobileUpdation,
    deleteCustomerAddress,
    postOrderFeedback,
    accountConfirmation,
  };
}

export default useAuth;
