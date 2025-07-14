import React from 'react'
import styles from '../styles/homepage_skeleton.module.scss'

function BlogPostSkeleton() {
  return (
    <div>
      <div className={`blog_post_skeleton ${styles.blog_post_skeleton}`}>
      <div className="container">
        <div className="heading flex items-start justify-between">
          <h2 className=" text-h2 mb-h2_btm">Our blogs</h2>
          <div>view all</div>
        </div>
        <div className='blog_post_container_skeleton'>
          <div className='grid_skeleton'>

            <div className='grid_skeleton_item item_1'>
              <div className='blog_img_skeleton'></div>
              <div className='blog_content_skeleton'>
                <div className='top_content_skeleton'>
                  <div className='date_skeleton'></div>
                  <div className='title_skeleton'></div>
                </div>
                <div className='bottom_content_skeleton'>
                  <div className='profile_skeleton'>
                    <div className='profile_img_skeleton'></div>
                    <div className='profile_name_skeleton'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid_skeleton_item item_2'>
            <div className='blog_img_skeleton'></div>
              <div className='blog_content_skeleton'>
                <div className='top_content_skeleton'>
                  <div className='date_skeleton'></div>
                  <div className='title_skeleton'></div>
                </div>
                <div className='bottom_content_skeleton'>
                  <div className='profile_skeleton'>
                    <div className='profile_img_skeleton'></div>
                    <div className='profile_name_skeleton'></div>
                  </div>
                </div>
              </div>
            </div>


            <div className='grid_skeleton_item item_3'>
              <div className='blog_img_skeleton'></div>
              <div className='blog_content_skeleton'>
                <div className='top_content_skeleton'>
                  <div className='date_skeleton'></div>
                  <div className='title_skeleton'></div>
                </div>
                <div className='bottom_content_skeleton'>
                  <div className='profile_skeleton'>
                    <div className='profile_img_skeleton'></div>
                    <div className='profile_name_skeleton'></div>
                  </div>
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

export default BlogPostSkeleton
