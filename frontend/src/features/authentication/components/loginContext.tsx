import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  RequestOtpForEmailLoginType,
  RequestOtpForMobile,
  VerifyMobileOtp,
} from "../apollo/mutations";
import useAuth from "../hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { updateToken } from "../slice/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBlocking } from "./blockingContext";
import { useToast } from "@/components/ui/use-toast";
import { useErrorHandler } from "@/utils";
import makeClient from "@/lib/apollo/apolloProvider";

type LoginContextType = {
  currentScreen: "form" | "otp";
  setCurrentScreen: Dispatch<SetStateAction<"form" | "otp">>;
  isMobileOtp: boolean;
  setIsMobileOtp: Dispatch<SetStateAction<boolean>>;
  otpGivenEmail: string | null;
  otpGivenMobile: string | null;
  requestingOtp: boolean;
  logingIn: boolean;
  requestOtpForEmail: (
    email: string,
    websiteid?: number,
    onSuccess?: (response: RequestOtpForEmailLoginType["Response"]) => void
  ) => void;
  requestOtpForMobile: (
    mobileNumber: string,
    websiteid?: number,
    onSuccess?: (response: RequestOtpForMobile["Response"]) => void
  ) => void;
  loginWithPhone: ({
    mobileNumber,
    otp,
    websiteId,
  }: VerifyMobileOtp["Variables"]) => void;
  loginWithEmailFn: (otp: string) => void;
  handleBack: () => void;
} | null;
const loginContext = createContext<LoginContextType>(null);

export const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    requestOtpForloginWithEmail: [
      requestOtpForloginWithEmail,
      requestOtpForloginWithEmailStatus,
    ],
    loginWithEmail: [loginWithEmail, loginWithEmailStatus],
    requestOtpForMobileLogin: [
      requestOtpForMobileLogin,
      requestOtpForMobileLoginStatus,
    ],
    verifyMobileOtp: [verifyMobileOtp, verifyMobileOtpStatus],
  } = useAuth();
  const searchParams = useSearchParams();
  const paramsObject = Object.fromEntries(searchParams.entries());
  delete paramsObject.signin;
  const queryString = new URLSearchParams(paramsObject).toString();
  const { storeToLocalStorage, isBlocked } = useBlocking();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const client = makeClient();
  const { toast } = useToast();
  // propreties
  const [currentScreen, setCurrentScreen] = useState<"form" | "otp">("form");
  const [otpGivenEmail, setOtpGivenEmail] = useState<string | null>(null);
  const [otpGivenMobile, setOtpGivenMobile] = useState<string | null>(null);
  const [isMobileOtp, setIsMobileOtp] = useState<boolean>(false);

  console.log("paramsObject", queryString);

  // methods
  const requestOtpForEmail = useCallback(
    (
      email: string,
      websiteid?: number,
      onSuccess?: (response: RequestOtpForEmailLoginType["Response"]) => void
    ) => {
      setOtpGivenMobile(null);
      if (!isBlocked) {
        storeToLocalStorage().then((otpCount) => {
          console.log("otp count", otpCount);

          if (otpCount < 4) {
            requestOtpForloginWithEmail({
              variables: {
                input: {
                  email: email,
                  website_id: websiteid,
                },
              },
              onCompleted(data, clientOptions) {
                if (
                  data.generateAndSendOtp.response ===
                  "OTP has been sent successfully."
                ) {
                  onSuccess?.(data);
                  setCurrentScreen("otp");
                  setOtpGivenEmail(email);
                } else {
                  toast({
                    title: "Ooops!!",
                    description: data.generateAndSendOtp.response,
                    variant: "error",
                  });
                }
              },
            });
          } else {
            setCurrentScreen("otp");
          }
        });
      } else {
        setCurrentScreen("otp");
      }
    },
    [isBlocked, requestOtpForloginWithEmail, storeToLocalStorage, toast]
  );

  const loginWithEmailFn = useCallback(
    (otp: string) => {
      if (otp && otpGivenEmail)
        loginWithEmail({
          variables: {
            email: otpGivenEmail,
            password: otp,
          },
          onCompleted(data, clientOptions) {
            if (data.generateCustomerToken.token) {
              setOtpGivenEmail(null);
              dispatch(updateToken(data.generateCustomerToken.token));
              router.replace(
                `${pathname}${queryString ? `?${queryString}` : ''}`
              );

            }
          },
        });
    },
    [otpGivenEmail, loginWithEmail, dispatch, router, pathname]
  );

  const requestOtpForMobile = useCallback(
    (
      mobileNumber: string,
      websiteid?: number,
      onSuccess?: (response: RequestOtpForMobile["Response"]) => void
    ) => {
      setOtpGivenEmail(null);
      if (!isBlocked) {
        storeToLocalStorage().then((otpCount) => {
          console.log("otp count", otpCount);

          if (otpCount < 4) {
            requestOtpForMobileLogin({
              variables: {
                mobileNumber: mobileNumber,
                websiteId: 1,
                isresend: false,
              },
              onCompleted(data, clientOptions) {
                if (data.loginOTP) {
                  const parsedRepsonse = JSON.parse(
                    data.loginOTP.response as string
                  ) as { status: boolean; message: string }[];
                  if (parsedRepsonse?.[0].status) {
                    onSuccess?.(data);
                    setCurrentScreen("otp");
                    setOtpGivenMobile(mobileNumber);
                  } else {
                    toast({
                      title: "Ooops!",
                      description:
                        parsedRepsonse?.[0].message || "OTP request rejected",
                      variant: "error",
                    });
                  }
                }
              },
            });
          } else {
            setCurrentScreen("otp");
          }
        });
      } else {
        setCurrentScreen("otp");
      }
    },
    [isBlocked, requestOtpForMobileLogin, toast]
  );
  const loginWithPhone = useCallback(
    ({ mobileNumber, otp, websiteId }: VerifyMobileOtp["Variables"]) => {
      verifyMobileOtp({
        variables: {
          mobileNumber,
          otp,
          websiteId: websiteId || 1,
        },
        onCompleted(data, clientOptions) {
          if (data.loginOTPVerify) {
            const parsedRepsonse = JSON.parse(
              data.loginOTPVerify.response as string
            ) as { status: boolean; token: string; message: string }[];
            if (parsedRepsonse?.[0].status) {
              setOtpGivenMobile(null);
              dispatch(updateToken(parsedRepsonse?.[0].token));
              router.replace(
                `${pathname}${queryString ? `?${queryString}` : ''}`
              );
            } else {
              toast({
                title: "Ooops!",
                description: parsedRepsonse?.[0].message || "Login failed",
                variant: "error",
              });
            }
          }
        },
      });
    },
    [verifyMobileOtp, dispatch, router, pathname, toast]
  );

  const handleBack = () => {
    setCurrentScreen("form");
  };
  // ===

  const ctxObj = {
    currentScreen,
    setCurrentScreen,
    otpGivenEmail,
    otpGivenMobile,
    requestingOtp:
      requestOtpForloginWithEmailStatus.loading ||
      requestOtpForMobileLoginStatus.loading,
    logingIn: loginWithEmailStatus.loading || verifyMobileOtpStatus.loading,
    requestOtpForEmail,
    requestOtpForMobile,
    loginWithEmailFn,
    loginWithPhone,
    handleBack,
    isMobileOtp,
    setIsMobileOtp,
  };

  return (
    <loginContext.Provider value={ctxObj}>{children}</loginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(loginContext);
  if (!context) {
    throw new Error(
      "useLoginContext must be used within a LoginContextProvider"
    );
  }
  return context;
};
