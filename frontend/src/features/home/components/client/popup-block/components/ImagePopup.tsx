import { PopUp } from "@/generated/types";
import Image from "next/image";
import React, { useMemo } from "react";

type ImagePopupProps = {
  popUp: PopUp;
  closePopup: () => void;
};
function ImagePopup({ closePopup, popUp }: ImagePopupProps) {
  const popUpImage = useMemo(() => popUp.popup_image, [popUp]);

  return (
    <div className="img_popup_wrap">
      <Image
        src={popUpImage || ""}
        alt="popup"
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export default ImagePopup;
