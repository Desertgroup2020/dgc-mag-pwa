import React, { useContext } from "react";
import styles from "../../styles/style.module.scss";
import { useConfigurableContext } from "./configurableContext";
import SwatchConfigSelector from "./SwatchConfigSelector";

function ConfigurableScreen() {
  // hooks
  const { configurableOptions, configState, updateConfigOptions } =
    useConfigurableContext();

  //renders
  if (!configurableOptions) return null;

  console.log("configurable state", configState);
  
  return (
    <div className={`configurable_screens ${styles.configurable_screens}`}>
      {configurableOptions.map((configItem) => (
        <SwatchConfigSelector key={configItem.attribute_uid} configItem={configItem}/>
      ))}
    </div>
  );
}

export default ConfigurableScreen;
