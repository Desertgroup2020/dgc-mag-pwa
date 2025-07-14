"use client";

import React, { useEffect, useRef } from "react";
import TabsHolder from "../components/TabsHolder";
import { MyAccountPageType } from "@/app/my-account/[sectionName]/page";
import { AvailableRoutes } from "../hooks/useTabList";
import dynamic from "next/dynamic";
import DashboardScreen from "./DashboardScreen";
import { withAuth } from "@/hocs/ProtectedRoutes";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import RewardPoints from "./RewardPoints";

// import ProfileScreen from './ProfileScreen';
// import AddressBookScreen from './AddressBookScreen';
// import OrdersScreen from './OrdersScreen';
// import WishListScreen from './WishListScreen';

const ProfileScreen = dynamic(() => import("./ProfileScreen"), {
  loading: () => {
    return <span>Profile Loading...</span>;
  },
});
const AddressBookScreen = dynamic(() => import("./AddressBookScreen"), {
  loading: () => {
    return <span>Addresses Loading...</span>;
  },
});
const OrdersScreen = dynamic(() => import("./OrdersScreen"), {
  loading: () => {
    return <span>Orders Loading...</span>;
  },
});
const WishListScreen = dynamic(() => import("./WishListScreen"), {
  loading: () => {
    return <span>Wishlist Loading...</span>;
  },
});

function MyAccountClient({ params }: MyAccountPageType) {
  const { sectionName } = params;  
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const pathname = usePathname(); 
  // features
  const screenSwitcher = () => {
    switch (sectionName as AvailableRoutes) {
      case "profile":
        return <ProfileScreen />;
      case "addresses":
        return <AddressBookScreen />;
      case "orders":
        return <OrdersScreen />;
      case "wishlist":
        return <WishListScreen />;
      case "dashboard":
        return <DashboardScreen />;
      case "rewards":
        return <RewardPoints />;

      default:
        return <DashboardScreen />;
    }
  };
  
  

  if (!token) {
    return (
      <div className="login_redirect">
        <p>Please Login for Account</p>
        <Button
          variant={"action_green"}
          onClick={() => {
            router.push(`${pathname}?signin=dgc-login`);
          }}
          className="btn_action_green_rounded"
        >
          <BtnRightArrow />
          <span>Continue to account</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="my_account_client">
      <div className="container">
        <div className="divider">
          <div className="left">
            <TabsHolder params={params} />
          </div>
          <div className="right">{screenSwitcher()}</div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(MyAccountClient);
