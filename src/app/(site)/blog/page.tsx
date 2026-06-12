import BlogGridContainer from "@/components/Blog/BlogGridContainer";
import Breadcrumb from "@/components/Breadcrumb";
import { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts"; // Import your mock data

export const metadata: Metadata = {
  title: "Blog | AI Tool - Next.js Template for AI Tools",
  description: "This is Blog page for AI Tool",
};

export default async function BlogPage() {
  const posts = blogPosts; // Use your mock data directly

  return (
    <>
      <Breadcrumb pageTitle='Blog Grid' />
      <section className='pt-20 pb-17.5 lg:pt-25 lg:pb-22.5 xl:pb-27.5'>
        <div className='mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0'>
          <BlogGridContainer blogs={posts} />
        </div>
      </section>
    </>
  );
}