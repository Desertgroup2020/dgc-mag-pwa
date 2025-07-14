import React from 'react'
import styles from '../styles/productlist_skeleton.module.scss'
import FilterSkeleton from './FilterSkeleton'

function ProductListSkeleton() {
  return (
    <div>
      <div className={`product_list_skeleton ${styles.product_list_skeleton}`}>
          <div className="container">
             <div className='divider_skeleton'>

                <FilterSkeleton/>

                <div className='lister_skeleton'>
                  <div className='banner_skeleton'>
                    <div className='banner_content_skeleton'>
                      <div className='banner_title_skeleton'></div>
                      <div className='banner_desc_skeleton'></div>
                    </div>
                  </div>
                  <div className='ctrls_skeleton'>
                    <div className='breadcrumb_skeleton'></div>
                    <div className='sort_skeleton'>
                      <div className='sort_button_skeleton'></div>
                      <div className='sort_options_skeleton'></div>
                    </div>
                  </div>

                  <div className='product_list_grid_skeleton'>
                    <div className='skeleton_product_card flex flex-col '>
                      <div className='img_skeleton'></div>
                      <div className='desc_skeleton'>
                      <div className='textcard_num_skeleton'></div>
                      <div className='textcard_title_skeleton'></div>
                      <div className='textcard_price_skeleton'></div>
                      <div className='textcard_button_skeleton'></div>
                      </div>
                    </div>

                    <div className='skeleton_product_card flex flex-col'>
                      <div className='img_skeleton'></div>
                      <div className='desc_skeleton'>
                      <div className='textcard_num_skeleton'></div>
                      <div className='textcard_title_skeleton'></div>
                      <div className='textcard_price_skeleton'></div>
                      <div className='textcard_button_skeleton'></div>
                      </div>
                    </div>

                    <div className='skeleton_product_card flex flex-col '>
                      <div className='img_skeleton'></div>
                      <div className='desc_skeleton'>
                      <div className='textcard_num_skeleton'></div>
                      <div className='textcard_title_skeleton'></div>
                      <div className='textcard_price_skeleton'></div>
                      <div className='textcard_button_skeleton'></div>
                      </div>
                    </div>


                    <div className='skeleton_product_card flex flex-col'>
                      <div className='img_skeleton'></div>
                      <div className='desc_skeleton'>
                      <div className='textcard_num_skeleton'></div>
                      <div className='textcard_title_skeleton'></div>
                      <div className='textcard_price_skeleton'></div>
                      <div className='textcard_button_skeleton'></div>
                      </div>
                    </div>

                    <div className='skeleton_product_card flex flex-col '>
                      <div className='img_skeleton'></div>
                      <div className='desc_skeleton'>
                      <div className='textcard_num_skeleton'></div>
                      <div className='textcard_title_skeleton'></div>
                      <div className='textcard_price_skeleton'></div>
                      <div className='textcard_button_skeleton'></div>
                      </div>
                    </div>

                    <div className='skeleton_product_card flex flex-col'>
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
    </div>
    </div>
  )
}

export default ProductListSkeleton
