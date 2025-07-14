import React from "react";
import style from "./styles/categoryskeleton.module.scss";

function LoginSkelton() {
  return (
    <div className={`login_skelton ${style.login_skelton}`}>
      <div className="animate-pulse w-full heading bg-gray-300"></div>
      <div className="input_grup">
        <div className="animate-pulse w-1/3 label bg-gray-300"></div>
        <div className="animate-pulse w-full input bg-gray-300"></div>
      </div>
      <div className="animate-pulse w-full divider bg-gray-300"></div>
      <div className="input_grup">
      <div className="animate-pulse w-1/3 label bg-gray-300"></div>
        <div className="animate-pulse w-full input bg-gray-300"></div>
      </div>
      <div className="animate-pulse w-full heading bg-gray-300"></div>
      <div className="animate-pulse w-full submit_btn bg-gray-300"></div>
      <div className="animate-pulse w-full heading bg-gray-300"></div>
    </div>
  );
}

export default LoginSkelton;
