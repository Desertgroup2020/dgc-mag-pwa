import React from 'react'
import styles from '../styles/filter_skeleton.module.scss'

function FilterSkeleton() {
  return (
    <div className={`filter_skeleton ${styles.filter_skeleton}`}>

                  <div className='price_filter_skeleton'>
                    <div className='price_title_skeleton'></div>
                    <div className='content_skeleton'>
                    </div>
                  </div>

                  <div className='color_filter_skeleton'>
                    <div className='color_title_skeleton'></div>
                    
                    <div className='color_tile_skeleton'>
                      <div className='individual_tile_skeleton'>
                        <div className='round_skeleton'></div>
                        <div className='content_skeleton'></div>
                      </div>
                      <div className='individual_tile_skeleton'>
                        <div className='round_skeleton'></div>
                        <div className='content_skeleton'></div>
                      </div>

                      <div className='individual_tile_skeleton'>
                        <div className='round_skeleton'></div>
                        <div className='content_skeleton'></div>
                      </div>
                      <div className='individual_tile_skeleton'>
                        <div className='round_skeleton'></div>
                        <div className='content_skeleton'></div>
                      </div>

                    </div>

                    
                  </div>

                  <div className='category_filter_skeleton'>
                    <div className='catogory_title_skeleton'></div>
                    <div className='category_content_skeleton'>
                      <div className='individual_tile_skeleton block_tile'></div>
                    </div>
                  </div>

                </div> 
  )
}

export default FilterSkeleton
