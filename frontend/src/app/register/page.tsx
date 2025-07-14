// import RegistrationClient from '@/features/authentication/screens/register/RegistrationClient'
// export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";
import React, { Suspense } from "react";
import styles from "@/features/authentication/styles/register.module.scss";

const RegistrationClient = dynamicImport(
  () => import("@/features/authentication/screens/register/RegistrationClient"),
  { ssr: false }
);

function Register() {
  return (
    <section className={`register ${styles.register}`}>
      <div className="banner">
        <div className="container">
          <h1 className=" text-h1">SIGN UP</h1>
        </div>
      </div>
      <div className="container">
        <Suspense fallback={<h1>Loading registration</h1>}>
          {/* <BlockingContextProvider> */}
            <RegistrationClient />
          {/* </BlockingContextProvider> */}
        </Suspense>
      </div>
    </section>
  );
}

export default Register;
