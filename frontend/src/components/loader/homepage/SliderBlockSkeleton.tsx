import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function SliderBlockSkeleton() {
  return (
    <div className={`sliderblock_skeleton ${styles.sliderblock_skeleton} bg-gray-200 flex items-end`}>
      <div className="skeleton_content w-full text">
        <div className="container">
          <div className="skeleton_txt">
            <div className='skeleton_heading'>
              <div className='skeleton_line_1 bg-gray-200 rounded-xl'></div>
              <div className='skeleton_line_2 bg-gray-200 rounded-xl'></div>
            </div>
            {/* <p className="text-h1 mb-h1_btm ">
            </p> */}
            <div className="bg-gray-300 skeleton_sub_txt rounded-xl">
            </div>
            <div className='skeleton_btn bg-gray-300 rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SliderBlockSkeleton
