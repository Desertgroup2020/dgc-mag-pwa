import Image from "next/image";
import React from "react";

function Loading() {
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

export default Loading;
