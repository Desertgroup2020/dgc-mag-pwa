"use client";

import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { Button } from "@/components/ui/button";
import { Post } from "@/generated/types";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type BlogDetailsClientProps = {
  blog: Post;
};
function BlogDetailsClient({ blog }: BlogDetailsClientProps) {
  const { image, name, publish_date, post_content } = blog;
  const router = useRouter();

  // console.log("blog view", blog);

  return (
    <div className="blog_details">
      <div className="container">
        <div className="back_to">
          <Link
            href={"/"}
            onClick={(e) => {
              e.preventDefault();
              router.push("/blogs");
            }}
            className="view_all"
          >
            <ArrowLeft stroke="#7e8b53" className="icon" />
            <span>Back to blogs</span>
          </Link>          
        </div>
        <div className="divider">
          <div className="left">
            <figure className="blog_img">
              <Image
                src={`${image || `/assets/images/blog_post_image.png`}`}
                alt="blog image"
                width={800}
                height={1000}
              />
            </figure>
          </div>
          <div className="right">
            <div className="details">
              <h1 className=" text-h2">{name}</h1>
              <span className="date">
                {moment(blog.publish_date).format("DD/MM/YYYY")}
              </span>
              <div
                className="txt"
                dangerouslySetInnerHTML={{ __html: post_content || "" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailsClient;
