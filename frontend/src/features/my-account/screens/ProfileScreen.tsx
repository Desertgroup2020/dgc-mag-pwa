import Link from "next/link";
import React from "react";
import GeneralInfo from "../components/GeneralInfo";
import styles from '../styles/account.module.scss';
import SecurityInfo from "../components/SecurityInfo";

function ProfileScreen() {
  return (
    <div className={`profile_screen ${styles.profile_screen}`}>
      <div className="heading">
        <h2 className="text-h1">Profile</h2>
        <Link href={"/my-account/orders"} rel="orders">
          <span>View your orders and delivery status </span>
        </Link>
      </div>
      <GeneralInfo />
      <SecurityInfo />
    </div>
  );
}

export default ProfileScreen;
