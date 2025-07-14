"use client";

import { Post } from "@/generated/types";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import React from "react";
import style from "../../styles/blog_posts.module.scss";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import moment from "moment";

interface BlogPostsClientProps {
  blogPosts: Post[];
}
function BlogPostsClient({ blogPosts }: BlogPostsClientProps) {
  const winWidth = useAppSelector((state) => state.window.windDim.width);
  return (
    <div className="blog_post_container">
      <div className="grid">
        {blogPosts.map((blog, i) => (
          <div className={`grid_item item${i + 1}`} key={blog.post_id}>
            <div
              className={`blog_card ${style.blog_card} ${
                i === 0 && winWidth > 767 ? "portrait" : ""
              }`}
            >
              <figure className="blog_img">
                <Image
                  src={blog.image || `/assets/images/blog_post_image.png`}
                  alt="blog image"
                  width={640}
                  height={289}
                />
              </figure>
              <div className="contents">
                <div className="top_cnt">
                  <span className="date">{moment(blog.publish_date).format("DD/MM/YYYY")}</span>
                  <h5 className="title">{blog.name}</h5>
                </div>
                <div className="btm_cnt">
                  {/* <div className="profile">
                                        <Image src={'/assets/images/dgc-logo.png'} alt='author image' width={40} height={40}/>
                                        <span className="name">{blog.author_name}</span>
                                    </div> */}
                  <Link href={`/blogs/${blog.url_key}`}>
                    <Button
                      variant={"action_green"}
                      className="btn_action_green_rounded"
                    >
                      <BtnRightArrow />
                      <span>View more</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPostsClient;
