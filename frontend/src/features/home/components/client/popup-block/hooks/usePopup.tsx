import React, { useMemo } from "react";
import { PopUp } from "@/generated/types";
import { usePathname, useRouter } from "next/navigation";

export type PopUpHookProp = {
  popUp: PopUp;
};
export type PopUpType = "image" | "video" | "cmsblock";
function usePopup({ popUp }: PopUpHookProp) {
  const pathname = usePathname();
  const popUpType = useMemo(() => popUp.popup_type as PopUpType, [popUp]);
  const startDate = useMemo(() => popUp.start_date, [popUp]);
  const endDate = useMemo(() => popUp.end_date, [popUp]);
  const redirectLink = useMemo(
    () =>
      popUp.click_url?.link_type === "default"
        ? popUp.click_url.external_url
        : `${popUp.click_url?.link_url}`,
    [popUp]
  );

  const isPopUpExpired = useMemo(() => {
    const currentDate = new Date();
    const startDateObj = new Date(startDate as string);
    const endDateObj = new Date(endDate as string);

    return currentDate > endDateObj;
  }, [startDate, endDate]);

  return {
    redirectLink,
    isPopUpExpired,
    popUpType,
  };
}

export default usePopup;
