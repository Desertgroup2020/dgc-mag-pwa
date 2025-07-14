"use client"
import React from 'react'
import Indicators from './Indicators'
import HeaderLogin from './Login'

const RightSideHeader = () => {
  return (
    <div className=' flex items-center'>
        <Indicators />
        <HeaderLogin />
    </div>
  )
}

export default RightSideHeader