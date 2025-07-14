import React from 'react'
import styles from '../styles/details_cms_skeleton.module.scss'

function DetailsTabCmsSkeleton() {
  return (
    <div className={`details_cms_skeleton ${styles.details_cms_skeleton}`}>
      <div className='title_skeleton bg-gray-200'></div>
      <div className='subtitle_skeleton bg-gray-200'></div>
      <div className='cms_skeleton_grid'>
        <div className='heading_section'>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
        </div>
        <div className='row_section'>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
        </div>
        <div className='row_section'>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
        </div>

        <div className='row_section'>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
        </div>
        <div className='row_section'>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
        </div>

        <div className='row_section'>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
        </div>
        <div className='row_section'>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
          <div className='column_skeleton bg-gray-100'></div>
          <div className='column_skeleton bg-gray-200'></div>
        </div>
        
      </div>
    </div>
  )
}

export default DetailsTabCmsSkeleton
