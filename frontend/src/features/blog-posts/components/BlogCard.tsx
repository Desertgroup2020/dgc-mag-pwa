"use client";

import { Post } from "@/generated/types";
import style from "../../home/styles/blog_posts.module.scss";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { usePathname } from "next/navigation";
import moment from "moment";
import { useAppSelector } from "@/redux/hooks";

type BlogCardProps = {
  blog: Post;
};
function BlogCard({ blog }: BlogCardProps) {
  const pathname = usePathname();
  const urlKey = useMemo(() => blog.url_key, [blog]);
  const viewMoreLink = `${pathname}/${urlKey}`;
  const winWidth = useAppSelector(state=>state.window.windDim.width);

  return (
    <div className={`blog_card ${style.blog_card}`}>
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
          <span className="date">
            {moment(blog.publish_date).format("DD/MM/YYYY")}
          </span>
          <h5 className="title">{blog.name}</h5>
        </div>
        <div className="btm_cnt">
          <Link href={viewMoreLink}>
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
  );
}

export default BlogCard;
