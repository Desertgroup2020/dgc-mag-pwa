import { ApolloWrapper } from "@/lib/apollo/apolloProvider";
import dynamic from "next/dynamic";
import React, { ReactNode, Suspense } from "react";
import Header from "./header";
import Footer from "./footer";
// import StoreConfigIntialize from "@/features/store-config/hooks/StoreConfigIntialize";
// import WishlistIntialize from "@/features/wishlist/hooks/WishlistIntialize";
// import BlockingContextProvider  from "@/features/authentication/components/blockingContext";
// import CountryCodeProvider from "@/lib/countryCodes";

const StoreProvider = dynamic(() => import("@/redux/StoreProvider"), {
  ssr: false,
});
const CountryCodeProvider = dynamic(() => import("@/lib/countryCodes"), {
  ssr: false,
});
const WindowDimension = dynamic(
  () => import("@/redux/window/WindowDimension"),
  { ssr: false }
);
const AuthIntialize = dynamic(
  () => import("@/features/authentication/hooks/Authintialize"),
  { ssr: false }
);
const CartIntialize = dynamic(
  () => import("@/features/cart/hooks/CartIntialization"),
  { ssr: false }
);
const BlockingContextProvider = dynamic(
  () => import("@/features/authentication/components/blockingContext"),
  { ssr: false }
);
const WishlistIntialize = dynamic(
  () => import("@/features/wishlist/hooks/WishlistIntialize"),
  { ssr: false }
);
const StoreConfigIntialize = dynamic(
  () => import("@/features/store-config/hooks/StoreConfigIntialize"),
  { ssr: false }
);

interface PageWraperProps {
  children: ReactNode;
}

function PageWraper({ children }: PageWraperProps) {
  return (
    <ApolloWrapper>
      <StoreProvider>
        <CountryCodeProvider>
          <BlockingContextProvider>
            <Suspense>
              <WindowDimension />
              <AuthIntialize />
              <CartIntialize />
              <WishlistIntialize />
              <StoreConfigIntialize />
            </Suspense>
            <div className="page_wraper">
              <Header />
              {children}
              <Footer />
            </div>
          </BlockingContextProvider>
        </CountryCodeProvider>
      </StoreProvider>
    </ApolloWrapper>
  );
}

export default PageWraper;
