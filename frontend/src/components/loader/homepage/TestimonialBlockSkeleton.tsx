import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function TestimonialBlockSkeleton() {
  return (
    <div>
      <div className={`testimonial_block_skeleton ${styles.testimonial_block_skeleton}`}>
        <div className='container'>
          <h2 className=" text-h2 mb-h2_btm">Lets hear from customers</h2>
          <div className='testimonial_grid_skeleton'>
            <div className='testimonial_card_skeleton bg-gray-100'>
            <div className='profile_skeleton'>
                <div className='img_skeleton bg-gray-200'></div>
                <div className='profile_content_skeleton'>
                  <div className='profile_name_skeleton bg-gray-200'>
                  </div>
                  <div className='date_skeleton bg-gray-200'></div>
                </div>
              </div>
              <div className='paragraph_skeleton bg-gray-200'></div>
            </div>
           
            <div className='testimonial_card_skeleton bg-gray-200'>
              <div className='profile_skeleton'>
                <div className='img_skeleton bg-gray-100'></div>
                <div className='profile_content_skeleton'>
                  <div className='profile_name_skeleton bg-gray-100'>
                  </div>
                  <div className='date_skeleton bg-gray-100'></div>
                </div>
              </div>
              <div className='paragraph_skeleton bg-gray-100'></div>
            </div>


            <div className='testimonial_card_skeleton bg-gray-100'>
            <div className='profile_skeleton'>
                <div className='img_skeleton bg-gray-200'></div>
                <div className='profile_content_skeleton'>
                  <div className='profile_name_skeleton bg-gray-200'>
                  </div>
                  <div className='date_skeleton bg-gray-200'></div>
                </div>
              </div>
              <div className='paragraph_skeleton bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialBlockSkeleton
