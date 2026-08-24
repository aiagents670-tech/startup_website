// ─── Supabase Database Types ───────────────────────────────────────────────
// Auto-typed for all CMS tables

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface DbService {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  category: string | null;
  icon: string | null;
  image_url: string | null;
  short_description: string;
  full_description: string | null;
  features: string[];
  technologies: string[];
  pricing: string | null;
  delivery_time: string | null;
  button_text: string;
  button_link: string;
  color: string;
  bg: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface DbPortfolio {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: string;
  client_name: string | null;
  image_url: string | null;
  short_description: string;
  full_description: string | null;
  technologies: string[];
  features: string[];
  demo_url: string | null;
  github_url: string | null;
  case_study: string | null;
  completion_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface DbBlog {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  author: string;
  category: string | null;
  image_url: string | null;
  short_description: string;
  content: string;
  tags: string[];
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
}

export interface DbTestimonial {
  id: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  company: string;
  position: string;
  image_url: string | null;
  review: string;
  rating: number;
  project: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface DbContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  business_type: string;
  service: string;
  budget: string;
  message: string;
  is_read: boolean;
  replied_at: string | null;
}

export interface DbSetting {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  type: 'service' | 'portfolio' | 'blog';
}
