import SingleBlog from "./SingleBlog";

// Temporary inline mock data for the blog section
const recentPosts = [
  {
    _id: 1,
    title: "Getting Started with AI Tools",
    slug: "getting-started-with-ai-tools",
    metadata: "Learn how to leverage AI tools for your business and boost productivity.",
    mainImage: "/images/blog/ai-tools.jpg",
    author: {
      name: "John Doe",
      image: "/images/authors/john-doe.jpg",  // Added missing image property
      bio: "AI enthusiast"
    },
    tags: ["AI", "Productivity"],
    publishedAt: "2024-01-15"
  },
  {
    _id: 2,
    title: "10 Ways to Boost Your Productivity",
    slug: "10-ways-to-boost-productivity",
    metadata: "Discover proven productivity hacks using modern technology.",
    mainImage: "/images/blog/productivity.jpg",
    author: {
      name: "Jane Smith",
      image: "/images/authors/jane-smith.jpg",  // Added missing image property
      bio: "Productivity coach"
    },
    tags: ["Productivity", "Tips"],
    publishedAt: "2024-01-10"
  },
  {
    _id: 3,
    title: "The Future of Artificial Intelligence",
    slug: "future-of-artificial-intelligence",
    metadata: "Explore the latest trends and predictions for AI technology.",
    mainImage: "/images/blog/ai-future.jpg",
    author: {
      name: "John Doe",
      image: "/images/authors/john-doe.jpg",  // Added missing image property
      bio: "AI enthusiast"
    },
    tags: ["AI", "Trends"],
    publishedAt: "2024-01-05"
  }
];

const BlogSection = () => {
  return (
    <section className="pb-17.5 pt-20 lg:pb-22.5 lg:pt-25 xl:pb-27.5">
      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Latest Blogs</h2>
          <p className="text-gray-400">
            Stay updated with our latest articles and insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7.5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((blog, i) => (
            <SingleBlog key={blog._id || i} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;