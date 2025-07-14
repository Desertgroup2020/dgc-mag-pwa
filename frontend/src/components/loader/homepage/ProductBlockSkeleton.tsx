import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function ProductBlockSkeleton() {
  return (
    <div>
      <div className={`product_block_skeleton ${styles.product_block_skeleton}`}>
        <div className='container'>
          <div className='skeleton_heading flex items-start justify-between'>
            <h2 className='w-[158px] h-[32px] mb-[26px] bg-gray-100'>
            </h2>
            <div className='w-[54px] h-[16px] bg-gray-100'>
            </div>
          </div>
          <div className='product_skeleton_grid'>
            <div className='skeleton_product_card flex flex-col bg-gray-200'>
              <div className='img_skeleton'></div>
              <div className='desc_skeleton'>
                <div className='textcard_num_skeleton'></div>
                <div className='textcard_title_skeleton'></div>
                <div className='textcard_price_skeleton'></div>
                <div className='textcard_button_skeleton'></div>
              </div>
            </div>
            <div className='skeleton_product_card flex flex-col bg-gray-100'>
              <div className='img_skeleton'></div>
              <div className='desc_skeleton'>
                <div className='textcard_num_skeleton'></div>
                <div className='textcard_title_skeleton'></div>
                <div className='textcard_price_skeleton'></div>
                <div className='textcard_button_skeleton'></div>
              </div>
            </div>
            <div className='skeleton_product_card flex flex-col bg-gray-200'>
              <div className='img_skeleton'></div>
              <div className='desc_skeleton'>
                <div className='textcard_num_skeleton'></div>
                <div className='textcard_title_skeleton'></div>
                <div className='textcard_price_skeleton'></div>
                <div className='textcard_button_skeleton'></div>
              </div>
            </div>
            <div className='skeleton_product_card flex flex-col bg-gray-100'>
              <div className='img_skeleton'></div>
              <div className='desc_skeleton'>
                <div className='textcard_num_skeleton'></div>
                <div className='textcard_title_skeleton'></div>
                <div className='textcard_price_skeleton'></div>
                <div className='textcard_button_skeleton'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductBlockSkeleton
