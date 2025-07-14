import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function BrandBlockSkeleton() {
  return (
    <div>
       <div className={`brand_block_skeleton ${styles.brand_block_skeleton}`}>
          <div className='container'>
            <div className='brand_carousel_home_skeleton'>
              <div className='brand_side_skeleton'>
                <h2 className="brand_side_title text-h2">Choose from top brands</h2>
                <div className="view_all_skeleton">
                   View all
                </div>
              </div> 
              <div className='carousel_card_skeleton bg-gray-200'></div> 
              <div className='carousel_card_skeleton bg-gray-100'></div> 
              <div className='carousel_card_skeleton bg-gray-200'></div> 
              <div className='carousel_card_skeleton bg-gray-100'></div> 
              <div className='carousel_card_skeleton bg-gray-200'></div>    
            </div>
          </div>
       </div>
    </div>
  )
}

export default BrandBlockSkeleton
