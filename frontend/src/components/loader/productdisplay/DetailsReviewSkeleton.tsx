import React from 'react'
import styles from '../styles/details_review_skeleton.module.scss'
import AddButtonSkeleton from './AddButtonSkeleton'

function DetailsReviewSkeleton() {
  return (
    <div className={`details_review_skeleton ${styles.details_review_skeleton}`}>
      <div className='button_container_skeleton'>
        <AddButtonSkeleton/>
      </div>
      <div className='review_section_skeleton'>
        <div className='left_skeleton'>
          <div className='name_skeleton'></div>
          <div className='date_skeleton'></div>
        </div>
        <div className='right_skeleton'>
          <div className='title_skeleton'></div>
          <div className='content_skeleton'></div>
        </div>
      </div>
      <div className='review_section_skeleton'>
        <div className='left_skeleton'>
          <div className='name_skeleton'></div>
          <div className='date_skeleton'></div>
        </div>
        <div className='right_skeleton'>
          <div className='title_skeleton'></div>
          <div className='content_skeleton'></div>
        </div>
      </div>
      
    </div>
  )
}

export default DetailsReviewSkeleton
