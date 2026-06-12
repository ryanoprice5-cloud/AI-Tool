// Remove Sanity import - NO LONGER NEEDED
// import { PortableTextBlock } from "sanity";

export type Author = {
  name: string;
  image: string;
  bio?: string;
  slug?: string;  // Changed from 'any' to 'string' for better type safety
  _id?: number | string;
  _ref?: number | string;
};

export type Blog = {
  _id: number;
  title: string;
  slug: string;  // Changed from 'any' to 'string'
  metadata?: string;
  body?: string;  // Changed from PortableTextBlock[] to string (HTML content or plain text)
  mainImage?: string;  // Changed from 'any' to 'string' (image URL)
  author?: Author;
  tags?: string[];
  publishedAt?: string;
};