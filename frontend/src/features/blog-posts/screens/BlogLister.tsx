"use client";

import { PostsOutput } from "@/generated/types";
import React, { useMemo } from "react";
import BlogCard from "../components/BlogCard";
import Pagination from "@/components/pagination";
import { usePathname, useRouter } from "next/navigation";

type BlogListerProps = {
  mpBlogPosts: PostsOutput;
};
function BlogLister({ mpBlogPosts }: BlogListerProps) {
    const pathname = usePathname();
    const router = useRouter();
  const blogItems = useMemo(() => mpBlogPosts.items, [mpBlogPosts]);
  const currentpage = useMemo(
    () => mpBlogPosts.pageInfo?.currentPage || 1,
    [mpBlogPosts]
  );
  const totalPages = useMemo(() => {
    if (mpBlogPosts.total_count && mpBlogPosts.pageInfo?.pageSize) {
      return Math.ceil(mpBlogPosts.total_count / mpBlogPosts.pageInfo?.pageSize);
    }else{
        return 1
    }
  }, [mpBlogPosts]);

  const onPageChange = (page:number)=>{
    router.push(`${pathname}?page=${page}`)
  }

  return (
    <div className="blogs_wrapper">
      <div className="blog_lister">
        {blogItems?.map((blog, i) => (
          <BlogCard blog={blog!} key={blog?.post_id} />
        ))}
      </div>
      <div className="pagination">
        {
            ((currentpage <= totalPages) && totalPages !== 1) ? (
              <Pagination onPageChange={onPageChange} currentPage={currentpage!} totalPages={totalPages || 1} />
            ): null
        }        
      </div>
    </div>
  );
}

export default BlogLister;
