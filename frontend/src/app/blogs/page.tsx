import { getClient } from "@/lib/apollo/client";
import React from "react";
import { DefaultProps } from "../[...slug]/page";
import {
  BLOG_POSTS_QUERY,
  BlogPostsQueryType,
} from "@/features/blog-posts/apollo/queries";
import styles from "../../features/blog-posts/styles/style.module.scss";
import { PostsOutput } from "@/generated/types";
import BlogLister from "@/features/blog-posts/screens/BlogLister";

async function BlogPosts({ searchParams }: DefaultProps) {
  const pageSize = 8;
  const currentPage = parseInt(searchParams.page as any) || 1;
  const client = getClient();

  const blogs = await client
    .query<BlogPostsQueryType["Response"], BlogPostsQueryType["Variables"]>({
      query: BLOG_POSTS_QUERY,
      variables: {
        action: "get_post_list",
        currentPage: currentPage,
        pageSize: pageSize,
      },
      fetchPolicy: "no-cache",
    })
    .catch((err) => {
      throw err;
    });
  const mpBlogList = blogs.data.mpBlogPosts;

  // console.log("mp blog", blogs.data.mpBlogPosts);
  
  if (!mpBlogList.items?.length || !mpBlogList) return null;

  return (
    <section className={`blog_posts_lister ${styles.blog_posts_lister}`}>
      <div className="banner">
        <div className="container">
          <h1 className="text-h1">BLOGS</h1>
        </div>
      </div>
      <div className="container">
        <BlogLister mpBlogPosts={mpBlogList as PostsOutput} />
      </div>
    </section>
  );
}

export default BlogPosts;
