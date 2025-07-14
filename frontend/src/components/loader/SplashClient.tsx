"use client"

import Loading from "@/app/loading";
import React, { useEffect, useState } from "react";

function SplashClient() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  if (!isVisible) return null;
  return (
    <div
      className="loading_stage flex justify-center fixed bg-white"
      style={{
        height: "100vh",
        width: "100vw",
        transition: "0.4s ease-in-out",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={"/assets/images/dgc-login-icon.gif"}
        alt="splash"
        style={{
          maxWidth: "100%",
          height: "auto",
          objectFit: "contain"
        }}
      />
      {/* <Image
        src={"/assets/images/dgc-login-icon.gif"}
        alt="splash"
        width={800}
        height={450}
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
      /> */}
    </div>
  );
}

export default SplashClient;
