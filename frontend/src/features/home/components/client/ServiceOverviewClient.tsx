"use client";

import styles from "../../styles/serviceoverview.module.scss";
import Image from "next/image";

const data = [
  {
    icon: "/number.png",
    title: "Expertise of 15+ Years in UAE",
  },
  {
    icon: "/leaf.png",
    title: "Wide Range of Healthy Plants",
  },
  {
    icon: "/uicon.png",
    title: "Exceptional Customer Service",
  },
];

const ServiceOverview = () => {
  return (
    <div className={`service_overview_home ${styles.service_overview_home}`}>
      <div className="inner">
        <div className="container service_flex">
          {data.map((item, i) => (
            <div className="service_bar" key={i}>
              <Image src={item.icon} width={85} alt={item.title} height={54} />
              <h5>{item.title}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceOverview;
