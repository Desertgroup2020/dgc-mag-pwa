"use client";

import React from "react";
import styles from "../styles/styles.module.scss";
import ContactForm from "../components/ContactForm";

function ContactUsClient() {
  return (
    <div className={`contact_contents ${styles.contact_contents}`}>
      <div className="container">
        <div className="divider">
          <div className="left">
            <ContactForm />
          </div>
          <div className="right">
            <div className="map_block">
              {/* <h3>google map iframe</h3> */}
              <div className="map_iframe">
                <iframe
                  width="820"
                  height="560"
                  id="gmap_canvas"
                  src="https://maps.google.com/maps?q=Dubai+Garden+Centre%2C+739+Sheikh+Zayed+Rd+-+next+to+Lexus+Showroom+-+Al+Quoz+-+Al+Quoz+Industrial+Area+3+-+Dubai&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  scrolling="no"
                ></iframe>
                <p className="map_underlying_txt">
                  Dubai Garden Centre, 739 Sheikh Zayed Rd - next to Lexus
                  Showroom - Al Quoz - Al Quoz Industrial Area 3 - Dubai
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsClient;
