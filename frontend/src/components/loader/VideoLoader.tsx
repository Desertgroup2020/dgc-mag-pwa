import React from 'react'
import styles from './styles/categoryskeleton.module.scss';
import { Video } from 'lucide-react';

function VideoLoader() {
  return (
    <div className={`video_loader ${styles.video_loader}`}>
        <Video width={100} height={100} className=' animate-pulse'/>
    </div>
  )
}

export default VideoLoader