import { PostsFilterInput, PostsOutput } from "@/generated/types";
import { gql } from "@apollo/client";

export const BLOG_POSTS_QUERY = gql`
  query BlogPosts(
    $action: String!
    $pageSize: Int
    $currentPage: Int
    $filter: PostsFilterInput
    $sortBy: String
  ) {
    mpBlogPosts(
      action: $action
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filter
      sortBy: $sortBy
    ) {
      total_count
      pageInfo {
        currentPage
        endPage
        hasNextPage
        hasPreviousPage
        pageSize
        startPage
      }
      items {
        allow_comment
        author_id
        author_name
        author_url
        author_url_key
        created_at
        enabled
        image
        import_source
        in_rss
        layout
        meta_description
        meta_keywords
        meta_robots
        meta_title
        name
        post_content
        post_id
        publish_date
        short_description
        store_ids
        updated_at
        url_key
        view_traffic
      }
    }
  }
`;

export type BlogPostsQueryType = {
    Response: {
        mpBlogPosts: PostsOutput,        
    },
    Variables: {
        action: string,
        filter?: PostsFilterInput,
        sortBy?: string,
        currentPage?: number,
        pageSize?: number        
    }
}
