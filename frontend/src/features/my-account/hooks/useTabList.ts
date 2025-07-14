import React from 'react'

// types
export type tabItem = {
  label: string,
  href: string,
  itemId: "item_profile" | "item_orders" | "item_addresses" | "item_wishlist" | "item_reward",
  sectionName: AvailableRoutes
}

export type AvailableRoutes = "profile" | "orders" | "addresses" | "wishlist" | "dashboard" | "rewards" 

function useTabList() {  
  // constants
  const tabList:tabItem[] = [
    {
      label: "Profile",
      href: "/my-account/profile",
      itemId: "item_profile",
      sectionName: "profile"
    },
    {
      label: "Orders",
      href: "/my-account/orders",
      itemId: "item_orders",
      sectionName: "orders"
    },
    {
      label: "Address Book",
      href: "/my-account/addresses",
      itemId: "item_addresses",
      sectionName: "addresses"
    },
    {
      label: "Wishlist",
      href: "/my-account/wishlist",
      itemId: "item_wishlist",
      sectionName: "wishlist"
    },
    {
      label: "Points & Rewards",
      href: "/my-account/rewards",
      itemId: "item_reward",
      sectionName: "rewards"
    },
  ]


  return {
    tabList
  }
}

export default useTabList