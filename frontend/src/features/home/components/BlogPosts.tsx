import {
  BLOG_POSTS_QUERY,
  BlogPostsQueryType,
} from "@/features/blog-posts/apollo/queries";
import { getClient } from "@/lib/apollo/client";
import React, { Suspense } from "react";
// import BlogPostsClient from "./client/BlogPostsClient";
import { Post } from "@/generated/types";
import styles from "../styles/blog_posts.module.scss";
import Link from "next/link";
import BtnRightArrow from "@/components/icons/BtnRightArrow";
import dynamic from "next/dynamic";

const BlogPostsClient = dynamic(() => import("./client/BlogPostsClient"), {
  ssr: false,
});

async function BlogPosts() {
  const { data } = await getClient().query<
    BlogPostsQueryType["Response"],
    BlogPostsQueryType["Variables"]
  >({
    query: BLOG_POSTS_QUERY,
    variables: {
      action: "get_post_list",
      sortBy: "Latest",
      pageSize: 3,
    },
  });

  const blogPosts = data.mpBlogPosts.items;
  // const sortedBlogPosts = [...(data.mpBlogPosts.items || [])]
  //   .sort((a, b) => {
  //     const dateA = a?.publish_date ? new Date(a.publish_date).getTime() : 0;
  //     const dateB = b?.publish_date ? new Date(b.publish_date).getTime() : 0;

  //     return dateB - dateA; // Descending order (latest first)
  //   })
  //   .slice(0, 3);

  console.log(blogPosts);

  if (!blogPosts?.length) return null;

  return (
    <div className={`home_blogs ${styles.home_blogs}`}>
      <div className="container">
        <div className="heading flex items-start justify-between">
          <h2 className=" text-h2 mb-h2_btm">Our blogs</h2>
          <Link href={"/blogs"} className="view_all">
            <BtnRightArrow fill="#7e8b53" stroke="#7e8b53" className="icon" />
            <span>view all</span>
          </Link>
        </div>
        <BlogPostsClient blogPosts={blogPosts as Post[]} />
      </div>
    </div>
  );
}

export default BlogPosts;
