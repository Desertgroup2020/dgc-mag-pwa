import React from 'react'

function useHot() {
    const productTypes:string[] = [
        "Chair / Stool",
        "Bed",
        "Dresser",
        "Swing",
        "Sofa Set",
        "Planter Box",
        "Trellis",
        "Fence",
        "Garden Bench",
        "Sun lounger",
        "Picnic Table",
        "Bar Table",
        "Dining Table",
        "Playhouse",
        "Kitchen Island",
        "Storage Cabinet",
        "Plant Stand",
        "Storage Shed",
        "Pergola / Gazebo",
        "Birdhouse",
        "Others" 
    ]

  return {
    productTypes
  }
}

export default useHot