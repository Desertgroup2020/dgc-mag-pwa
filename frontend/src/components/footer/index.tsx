import React from 'react'
import FooterComponent from './DesktopFooter'
import MobileFooter from './MobileFooter/MobileFooter'
import mainFooterStyles from "./styles/mainFooter.module.scss"

const Footer = () => {
  return (
    <div className={mainFooterStyles.main_footer}>
      <FooterComponent />
      <MobileFooter />
    </div>
  )
}

export default Footer