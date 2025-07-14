import SiteSheet from "@/components/reusable-uis/SiteSheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  LoginContextProvider,
  useLoginContext,
} from "@/features/authentication/components/loginContext";
// import OtpScreen from "@/features/authentication/components/OtpScreen";
// import LoginClient from "@/features/authentication/screens/login/LoginClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  handleSignInSheet,
  updateRouteChanging,
} from "@/redux/window/windowSlice";
import { LoaderCircle, LogIn, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import PageLoader from "./PageLoader";
import dynamic from "next/dynamic";
import LoginSkelton from "@/components/loader/LoginSkelton";
import OtpSkelton from "@/components/loader/OtpSkelton";

const LoginClient = dynamic(
  () => import("@/features/authentication/screens/login/LoginClient"),
  {
    ssr: false,
    loading() {
      return <LoginSkelton />;
    },
  }
);
const OtpScreen = dynamic(
  () => import("@/features/authentication/components/OtpScreen"),
  {
    ssr: false,
    loading() {
      return <OtpSkelton />;
    },
  }
);

function LoginBtn() {
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRouteChanging = useAppSelector((state) => state.window.routeChanging);
  const sheetOpen = useAppSelector((state) => state.window.enableSignIn);
  const paramsObject = Object.fromEntries(searchParams.entries());
  const queryString = new URLSearchParams(paramsObject).toString();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const onOpenChange = (open: boolean) => {
    // setSheetOpen((prev) => false);
    dispatch(handleSignInSheet(false));
    // dispatch(updateRouteChanging(true));
    // if (!open) {
    // router.push(pathname); // Redirect to homepage when sheet is closed
    // }
  };

  // Check if the query parameter "signin" exists
  useEffect(() => {
    const signinParam = searchParams.get("signin");
    dispatch(handleSignInSheet(signinParam === "dgc-login"));
  }, [searchParams, dispatch]);

  const handleButtonClick = () => {
    // Keep the current route and add the query parameter
    dispatch(handleSignInSheet(true));
    // router.push(`${pathname}?signin=dgc-login`);
  };

  console.log("pathname", paramsObject);

  // effects
  useEffect(() => {
    if (sheetOpen) {
      router.push(
        `${pathname}${
          !Object.keys(paramsObject).includes("signin")
            ? Object.keys(paramsObject).length
              ? `?${queryString}&signin=dgc-login`
              : "?signin=dgc-login"
            : Object.keys(paramsObject).length
            ? `?${queryString}`
            : ""
        }`
      );
    } else {
      router.push(
        `${pathname}?${
          Object.keys(paramsObject).length ? `${queryString}` : ""
        }`
      );
    }
  }, [sheetOpen]);

  if (pathname === "/wholesale-register") return null;
  return (
    <div className="login_btn">
      <Button
        onClick={handleButtonClick}
        // disabled={isRouteChanging}
        variant={"itself"}
      >
        {winWidth > 1199 ? (
          <span>Sign in/Sign Up</span>
        ) : (
          // <User width={20} height={20} />
          <LogIn width={20} height={20} />
        )}
      </Button>

      <SiteSheet
        opts={{ open: sheetOpen, onOpenChange: onOpenChange }}
        title="LOGIN"
        position="right"
        className={"login_sheet"}
        // notCloseOnOutside={true}
      >
        <PageLoader />
        {/* <BlockingContextProvider> */}
        <LoginContextProvider>
          <LoginRenderer />
        </LoginContextProvider>
        {/* </BlockingContextProvider> */}
      </SiteSheet>
    </div>
  );
}

export default LoginBtn;

function LoginRenderer() {
  const { currentScreen } = useLoginContext();

  return (
    <Tabs
      value={currentScreen}
      defaultValue={currentScreen}
      className="login_tabs"
    >
      <TabsContent value="form">
        <LoginClient />
      </TabsContent>
      <TabsContent value="otp">
        <OtpScreen />
      </TabsContent>
    </Tabs>
  );
}
