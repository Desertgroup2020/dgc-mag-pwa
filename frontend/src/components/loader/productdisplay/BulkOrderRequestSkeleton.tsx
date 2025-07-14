import React from 'react'
import styles from '../styles/bulkorder_skeleton.module.scss'

function BulkOrderRequestSkeleton() {
  return (
    <div className={`bulkorder_skeleton ${styles.bulkorder_skeleton}`}>
      <div className='label_input_skeleton'>
        <div className='label_skeleton'></div>
        <div className='input_skeleton'></div>
      </div>
      <div className='label_input_skeleton'>
        <div className='label_skeleton_2'></div>
        <div className='input_skeleton'></div>
      </div>

      <div className='label_input_skeleton'>
        <div className='label_skeleton'></div>
        <div className='input_skeleton'></div>
      </div>
      <div className='label_input_skeleton'>
        <div className='label_skeleton_2'></div>
        <div className='input_skeleton'></div>
      </div>

      <div className='label_input_skeleton'>
        <div className='label_skeleton'></div>
        <div className='input_skeleton'></div>
      </div>
     
     <div className='send_button_skeleton bg-gray-300'></div>
    </div>
  )
}

export default BulkOrderRequestSkeleton
