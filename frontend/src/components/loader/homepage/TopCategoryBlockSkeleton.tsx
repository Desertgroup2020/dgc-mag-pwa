import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function TopCategoryBlockSkeleton() {
  return (
    <div>
      <div className={`top_categoryblock_skeleton ${styles.top_categoryblock_skeleton}`}>
      <div className={`container`}>
        <h2 className=" text-h2 mb-h2_btm">Explore our top categories</h2>
        {/* <CategoryBlockClient categoryBlock={refinedCategoryBlock} /> */}
        <div className='top_category_skeleton_grid'>
          <div className='skeleton_category_card bg-gray-200'></div>
          <div className='skeleton_category_card bg-gray-200'></div>
          <div className='skeleton_category_card bg-gray-200'></div>
          <div className='skeleton_category_card bg-gray-200'></div>
          <div className='skeleton_category_card bg-gray-200'></div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TopCategoryBlockSkeleton
