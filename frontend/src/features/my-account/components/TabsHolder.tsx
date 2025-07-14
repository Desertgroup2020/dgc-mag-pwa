import React, { useState } from "react";
import styles from "../styles/account.module.scss";
import { useAppSelector } from "@/redux/hooks";
import useCustomer from "@/features/authentication/hooks/useCustomer";
import useTabList, { tabItem } from "../hooks/useTabList";
import { Button } from "@/components/ui/button";
import { MyAccountPageType } from "@/app/my-account/[sectionName]/page";
import Link from "next/link";
import { Award, CoinsIcon, User } from "lucide-react";
import ProfileIcon from "@/components/icons/ProfileIcon";
import OrderIcon from "@/components/icons/OrderIcon";
import AddressIcon from "@/components/icons/AddressIcon";
import WishlistIcon from "@/components/icons/WishlistIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import WishListAccountIcon from "@/components/icons/WishListAccountIcon";
import { Customer } from "@/generated/types";
import Modal from "@/components/reusable-uis/Modal";
import LogOutConfirmation from "./LogOutConfirmation";

function TabsHolder({ params: { sectionName } }: MyAccountPageType) {
  // hooks
  const { customerFirstName, customerEmail, handleLogOut } = useCustomer();
  const { tabList } = useTabList();

  // states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmLogoutModalOpen, setConfirmLogoutModalOpen] = useState(false);

  //   features
  const iconSwitcher = (tab: tabItem) => {
    switch (tab.sectionName) {
      case "profile":
        return <ProfileIcon fill="#494949" width={20} height={20} />;

      case "orders":
        return <OrderIcon fill="#494949" width={20} height={20} />;
      case "addresses":
        return <AddressIcon fill="#494949" width={20} height={30} />;
      case "wishlist":
        return <WishListAccountIcon fill="#494949" width={20} height={25} />;
      case "wishlist":
        return <WishListAccountIcon fill="#494949" width={20} height={25} />;
      case "rewards":
        return <Award stroke="#494949" width={20} height={25} />;
      default:
        break;
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionSelect = (tab: tabItem) => {
    // Handle the link navigation and close the dropdown
    setIsDropdownOpen(false);
  };

  const handleOpenLogoutConfirmationModal = ()=>{
    setConfirmLogoutModalOpen(prev=> !prev);
  }

  return (
    <div className={`tabs_holder ${styles.tabs_holder}`}>
      {customerFirstName && customerEmail ? (
        <div className="profile_welcome">
          <span className="name text-h3">Hey {customerFirstName}</span>
          <span className="email">{customerEmail}</span>
        </div>
      ) : null}

      <ul className="tab_list">
        {tabList.map((tab) => (
          <li key={tab.itemId}>
            <Link
              href={tab.href}
              className={`tab_item ${
                sectionName === tab.sectionName ? "active" : ""
              }`}
            >
              {iconSwitcher(tab)}
              <span>{tab.label}</span>
            </Link>
          </li>
        ))}
        {/* logout */}
        <li>
          <button className="tab_item" onClick={handleOpenLogoutConfirmationModal}>
            <LogOutIcon fill="#494949" width={20} height={30} />
            <span>Log out</span>
          </button>
        </li>
      </ul>
      {/* Dropdown for Mobile */}
      <div className="mobile_dropdown ">
        <button className="dropdown_toggle" onClick={handleDropdownToggle}>
          {iconSwitcher(tabList.find(tab => tab.sectionName === sectionName) || tabList[0])}
          <span>{tabList.find(tab => tab.sectionName === sectionName)?.label || "Select"}</span>
          <span className={`arrow ${isDropdownOpen ? "open" : ""}`} />
        </button>
        {isDropdownOpen && (
          <div className="dropdown_menu">
            {tabList.map((tab) => (
              <Link
                key={tab.itemId}
                href={tab.href}
                className={`dropdown_item ${sectionName === tab.sectionName ? "active" : ""}`}
                onClick={() => handleOptionSelect(tab)}
              >
                {iconSwitcher(tab)}
                <span>{tab.label}</span>
              </Link>
            ))}
            {/* Logout Option */}
            <button className="dropdown_item" onClick={handleOpenLogoutConfirmationModal}>
              <LogOutIcon fill="#494949" width={20} height={20} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* logout confirmation modal */}
      <Modal
        isOpen={confirmLogoutModalOpen}
        setIsOpen={handleOpenLogoutConfirmationModal}
        // notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <LogOutConfirmation />
      </Modal>
    </div>
  );
}

export default TabsHolder;
