"use client";

import React, { useMemo } from "react";
import menuStyles from "../styles/menu.module.scss";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_DYNAMIC_MENU, GetDynamicMenuType } from "../queries";

const Menu = () => {
  const { data, loading } = useQuery<GetDynamicMenuType["Response"]>(
    GET_DYNAMIC_MENU,
    {
      fetchPolicy: "no-cache",
    }
  );

  const dynamicMenuItems = useMemo(()=> data?.getMenu.headerMenu?.menuItems, [data]);

  if(loading) return(
    <div className="loader_wrap flex items-center">
      <div className="item min-w-3"></div>
      <div className="item"></div>
      <div className="item"></div>
    </div>
  )
  return (
    <div className={menuStyles.menu_wrapper}>
      {dynamicMenuItems?.map((menuItem, i) => (
        <Link href={`/${menuItem?.link}`} key={i}>
          <span className="font-500 menu_title">{menuItem?.text}</span>
        </Link>
      ))}      
    </div>
  );
};

export default Menu;
