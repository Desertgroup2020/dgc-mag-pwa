import React, { useState } from "react";
import { usePdpContext } from "../hooks/pdpContext";
import VideoLoader from "@/components/loader/VideoLoader";

function VideoHolder() {
  const { currentMedia } = usePdpContext();
  const [loading, setLoading] = useState(true);

  const handleCanPlay = () => {
    setLoading(false);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  return (
    <div className={`video_holder`}>
      {currentMedia?.media_type === "video-file" ? (
        <>
          {loading && <VideoLoader />}
          <video
            controls
            onCanPlay={handleCanPlay}
            onLoadStart={handleLoadStart}
            style={{ display: loading ? "none" : "block" }}
          >
            <source src={currentMedia?.media_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </>
      ) : (
        <iframe
          width="100%"
          height="345"
          src={`${currentMedia?.media_file}?autoplay=1`}
          frameBorder={0}
          allowFullScreen
          className="video_iframe"
        ></iframe>
      )}
    </div>
  );
}

export default VideoHolder;
