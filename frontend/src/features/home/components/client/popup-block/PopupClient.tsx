"use client";

import { PopUp } from "@/generated/types";
import React, { useState } from "react";
import usePopup from "./hooks/usePopup";
import { useRouter } from "next/navigation";
import ImagePopup from "./components/ImagePopup";
import VideoPopup from "./components/VideoPopup";
import CmsPopup from "./components/CmsPopup";
import Modal from "@/components/reusable-uis/Modal";
import Link from "next/link";

type PopupClientProps = {
  popUpData: PopUp;
};
function PopupClient({ popUpData }: PopupClientProps) {
  const router = useRouter();
  const { redirectLink, isPopUpExpired, popUpType } = usePopup({
    popUp: popUpData as PopUp,
  });
  const [isOpen, setIsOpen] = useState<boolean>(
    !!localStorage.getItem("renderedPopup")
      ? localStorage.getItem("renderedPopup") === "true"
        ? false
        : true
      : true
  );

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem("renderedPopup", "true");
  };

  const renderPopUps = () => {
    switch (popUpType) {
      case "image":
        return (
          <ImagePopup closePopup={closePopup} popUp={popUpData as PopUp} />
        );
        break;
      case "video":
        return (
          <VideoPopup closePopup={closePopup} popUp={popUpData as PopUp} />
        );
        break;
      case "cmsblock":
        return <CmsPopup closePopup={closePopup} popUp={popUpData as PopUp} />;
        return;
      default:
        break;
    }
  };

  console.log("pop up", popUpData);
  

  return (
    <>
      {popUpData?.desktop_status && !isPopUpExpired ? (
        <Modal
          className={`home_popup ${
            popUpType === "image"
              ? "img_popup"
              : popUpType === "video"
              ? "video_popup"
              : ""
          }`}
          isOpen={isOpen}
          setIsOpen={closePopup}
        >
          <Link
            href={redirectLink || ""}
            onClick={(e) => {
              if (popUpType === "video" || popUpType === "cmsblock") {
                e.preventDefault();
              }
            }}
          >{renderPopUps()}</Link>
        </Modal>
      ) : null}
    </>
  );
}

export default PopupClient;
