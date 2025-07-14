import dynamic from "next/dynamic";
import React, { Suspense, useMemo } from "react";
import headerLoginStyles from "../styles/headerlogin.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
// import AccountBtn from "../components/AccountBtn";
// import LoginBtn from "../components/LoginBtn";

const DynamicWholesaleIcon = dynamic(() => import("../../icons/WholesaleIcon"));
const AccountBtn = dynamic(() => import("../components/AccountBtn"), {
  ssr: false,
});
const LoginBtn = dynamic(() => import("../components/LoginBtn"), {
  ssr: false,
});

const HeaderLogin = () => {
  const { token, value } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const isThisWholesaler = useMemo(
    () => value?.additional_info?.profile_type === "wholesaler",
    [value]
  );

  return (
    <div className={headerLoginStyles.header_login}>
      {!isThisWholesaler ? (
        <div className="wholesale_icon_section">
          <Link href={"/b2b-register"} className="flex items-center">
            <DynamicWholesaleIcon stroke="#494949" className=" mr-1" />
            <span className="wholesale_icon_text">B2B</span>
          </Link>
        </div>
      ) : null}

      {/* <div className="header_sign_in"> */}
      {token ? <AccountBtn /> : <LoginBtn />}
      {/* </div> */}
    </div>
  );
};

export default HeaderLogin;
