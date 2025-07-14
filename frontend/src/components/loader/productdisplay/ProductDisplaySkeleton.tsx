import React from 'react'
import styles from '../styles/productdisplay_skeleton.module.scss'
import AddButtonSkeleton from './AddButtonSkeleton'
import ProductBlockSkeleton from '../homepage/ProductBlockSkeleton'

function ProductDisplaySkeleton() {
  
  return (
    <div className={`product_display_skeleton ${styles.product_display_skeleton}`}>
      <div className='container'>
        <div className='breadcrumbs_skeleton'>
        </div>
        <div className='title_skeleton'></div>
        <div className='divider_skeleton'>
          <div className='media_column_skeleton'>
            <div className='media_viewer_skeleton'></div>
            <div className='swipper_wrapper_skeleton'>
              <div className='img_skeleton'></div>
              <div className='img_skeleton'></div>
            </div>
          </div>
          <div className='about_column_skeleton'>
            <div className='title_heading_skeleton'></div>
            <div className='price_holder_skeleton'></div>
            <div className='cart_sec_skeleton'>
              <div className='stock_status_skeleton'></div>
              <div className='btn_grp_skeleton'>
                <div className='cntrls_skeleton'></div>
                <div className='btn_skeleton'></div>
                <AddButtonSkeleton/>
              </div>
            </div>
            <div className='bulk_enquiry_skeleton'></div>
            <div className='wish_compare_skeleton'>
              <div className='wishlist_option_skeleton'></div>
            </div>
            <div className='share_skeleton'>
              <div className='share_title'></div>
              <div className='share_options'></div>
            </div>
          </div>
        </div>

      </div>

      <div className='details_tabs_skeleton'>
        <div className='container'>
          <div className='tablist_skeleton'>
            <div className='tab_option_skeleton'>
              <div className='tab_active'></div>
            </div>
            <div className='tab_option_skeleton sm_screen'></div>
            <div className='tab_option_skeleton sm_screen'></div>
            <div className='arrow_skeleton'></div>
          </div>

          <div className='paragraph_skeleton_1'></div>
          <div className='paragraph_skeleton_2'></div>
          <div className='paragraph_skeleton_3'></div>
        </div>

        <div className='container details_sm_screen'>
          <div className='tablist_option'>
            <div className='tab_heading'></div>
            <div className='tab_arrow'></div>
          </div>

          <div className='tablist_option'>
            <div className='tab_heading'></div>
            <div className='tab_arrow'></div>
          </div>

        </div>
      </div>

      <ProductBlockSkeleton/>

      <ProductBlockSkeleton/>
    </div>
  )
}

export default ProductDisplaySkeleton
