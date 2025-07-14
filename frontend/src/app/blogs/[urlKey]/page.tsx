import { KeyValuePair } from "@/app/[...slug]/page";
import {
  BLOG_POSTS_QUERY,
  BlogPostsQueryType,
} from "@/features/blog-posts/apollo/queries";
import BlogDetailsClient from "@/features/blog-posts/screens/BlogDetailsClient";
import { Post } from "@/generated/types";
import { getClient } from "@/lib/apollo/client";
import { notFound } from "next/navigation";
import styles from "../../../features/blog-posts/styles/style.module.scss";
import React from "react";

type BlogDetailsProps = {
  params: {
    urlKey: string;
  };
  searchParams: KeyValuePair;
};

async function BlogDetails({ params }: BlogDetailsProps) {
  const urlKey = params.urlKey;
  const client = getClient();

  const blogs = await client
    .query<BlogPostsQueryType["Response"], BlogPostsQueryType["Variables"]>({
      query: BLOG_POSTS_QUERY,
      variables: {
        action: "get_post_list",
        filter: {
          url_key: {
            eq: urlKey,
          },
        },
        currentPage: 1,
        pageSize: 1,
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      throw err;
    });
  const currentBlog = blogs.data.mpBlogPosts.items?.[0];

  if(!currentBlog){
    notFound();
  }

  return <div className={`blog_details ${styles.blog_details}`}>
    <BlogDetailsClient blog={currentBlog as Post}/>
  </div>;
}

export default BlogDetails;
