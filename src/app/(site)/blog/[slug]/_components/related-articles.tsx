import SingleBlog from '@/components/Blog/SingleBlog';
import { blogPosts } from '@/data/blog-posts';

export async function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  // Get related posts (excluding current post, limit to 3)
  const relatedPosts = blogPosts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section>
      <h2 className='mt-25 mb-10 max-w-[579px] text-[34px] leading-[45px] font-semibold text-white'>
        Related Articles
      </h2>

      <div className='grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3'>
        {relatedPosts.map((blog, i) => (
          <SingleBlog key={blog._id || i} blog={blog} />
        ))}
      </div>
    </section>
  );
}