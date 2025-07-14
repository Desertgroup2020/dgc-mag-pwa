import React from 'react'
import styles from './styles/categoryskeleton.module.scss';
import { Image } from 'lucide-react';

function ImageLoader() {
  return (
    <div className={`video_loader ${styles.video_loader}`}>
        <Image width={100} height={100} className=' animate-pulse'/>
    </div>
  )
}

export default ImageLoader