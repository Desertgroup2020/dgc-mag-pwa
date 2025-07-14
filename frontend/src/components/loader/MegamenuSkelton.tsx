import React from "react";
import styles from "./styles/megamenuSkelton.module.scss";
import { Image } from "lucide-react";

function MegamenuSkelton() {
  return (
    <div className={`megamenu_skelton ${styles.megamenu_skelton}`}>
      <div className="divider">
        <div className="left">
          <div className="contents_area ">            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
            <div className="content_item">
              <p className="bg-gray-300 animate-pulse"></p>
              <ul className="list">
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
                <li className="bg-gray-300 animate-pulse"></li>
              </ul>
            </div>            
          </div>
        </div>
        <div className="right">
          <div className="image bg-gray-300 animate-pulse">
            <Image width={100} height={100} className=" animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MegamenuSkelton;
