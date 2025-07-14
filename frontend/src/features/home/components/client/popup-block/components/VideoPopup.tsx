import { PopUp } from "@/generated/types";
import React, { useMemo } from "react";

type VideoPopupProps = {
  popUp: PopUp;
  closePopup: () => void;
};
function VideoPopup({ closePopup, popUp }: VideoPopupProps) {
  const videoLink = useMemo(() => popUp.video_link, [popUp]);
  return (
    <div className="video_popup">
      <div className="video_bx">
        {/* <Image src={} /> */}
        <iframe
          width="800"
          height="460"
          src={videoLink + "?autoplay=1&mute=1"}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default VideoPopup;
