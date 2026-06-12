// src/data/blog-posts.ts
import { Blog } from "@/types/blog";

export const blogPosts: Blog[] = [
  {
    _id: 1,
    title: "Getting Started with AI Tools",
    slug: "getting-started-with-ai-tools",
    metadata: "Learn how to leverage AI tools for your business",
    body: "<p>Full blog content goes here...</p>",
    mainImage: "/images/blog/ai-tools.jpg",
    author: {
      name: "John Doe",
      image: "/images/authors/john-doe.jpg",
      bio: "AI enthusiast and tech writer"
    },
    tags: ["AI", "Getting Started"],
    publishedAt: "2024-01-15"
  },
  {
    _id: 2,
    title: "10 Ways to Boost Productivity",
    slug: "10-ways-to-boost-productivity",
    metadata: "Discover productivity hacks using modern technology",
    body: "<p>Full blog content goes here...</p>",
    mainImage: "/images/blog/productivity.jpg",
    author: {
      name: "Jane Smith",
      image: "/images/authors/jane-smith.jpg",
      bio: "Productivity coach"
    },
    tags: ["Productivity", "Tips"],
    publishedAt: "2024-01-10"
  }
];