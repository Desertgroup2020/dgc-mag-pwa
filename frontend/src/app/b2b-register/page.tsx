import React, { Suspense } from "react";
import styles from "@/features/authentication/styles/register.module.scss";
import dynamic from "next/dynamic";

const WholesaleRegistration = dynamic(()=>import("@/features/wholesale/screens/WholesaleRegistration"), {ssr: false});

function page() {
  return (
    <section className={`whole_sale_register ${styles.register}`}>
      <div className="banner">
        <div className="container">
          <h1 className=" text-h1">B2B Registration</h1>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<h1>Loading B2B Registration</h1>}>
          {/* <BlockingContextProvider> */}
            <WholesaleRegistration />
          {/* </BlockingContextProvider> */}
        </Suspense>
      </div>
    </section>
  );
}

export default page;
