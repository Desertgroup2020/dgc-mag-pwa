// export const dynamic = "force-dynamic";

import React from "react";
import styles from "../../../features/my-account/styles/account.module.scss";
import MyAccountClient from "@/features/my-account/screens/MyAccountClient";

export type MyAccountPageType = {
  params: {
    sectionName: string;
  };
};
function MyAccountPage({ params }: MyAccountPageType) {
  // console.log("params", params);

  return (
    <>
      <section className={`my_account ${styles.my_account}`}>
        <div className="banner">
          <div className="container">
            <h1 className="text-h1">My Account</h1>
          </div>
        </div>
        {/* <BlockingContextProvider> */}
          <MyAccountClient params={params} />
        {/* </BlockingContextProvider> */}
      </section>
    </>
  );
}

export default MyAccountPage;
