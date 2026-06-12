import BlogGridContainer from "@/components/Blog/BlogGridContainer";
import Breadcrumb from "@/components/Breadcrumb";
import { blogPosts } from "@/data/blog-posts";
import { Author } from "@/types/blog";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper function to get author name from slug
const getAuthorFromSlug = (slug: string) => {
  // Find a post by this author
  const post = blogPosts.find((post) => 
    post.author?.name?.toLowerCase().replace(/\s+/g, '-') === slug
  );
  return post?.author;
};

// Helper function to get posts by author
const getPostsByAuthorName = (authorName: string) => {
  return blogPosts.filter((post) => post.author?.name === authorName);
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { slug } = params;
  const author = getAuthorFromSlug(slug);
  const authorName = author?.name || slug;

  return {
    title: `Author: ${authorName} | Blog`,
    description: `Posts by ${authorName}`,
  };
}

const AuthorPage = async (props: Props) => {
  const params = await props.params;
  const { slug } = params;

  const author = getAuthorFromSlug(slug);
  
  if (!author) {
    notFound();
  }

  const posts = getPostsByAuthorName(author.name);

  return (
    <>
      <Breadcrumb pageTitle={author.name} />

      <section className="pb-17.5 pt-20 lg:pb-22.5 lg:pt-25 xl:pb-27.5">
        <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
          {posts.length > 0 ? (
            <BlogGridContainer blogs={posts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found by this author.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AuthorPage;