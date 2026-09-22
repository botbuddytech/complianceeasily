import type { BlogCategory, BlogPost } from '../../types/dashboard';

/** Real posts live in the database. These stay empty so admin screens never flash sample content. */
export const ADMIN_BLOG_CATEGORIES: BlogCategory[] = [];

export const ADMIN_BLOGS: BlogPost[] = [];

export function blogCategoryById(id: string): BlogCategory | undefined {
  return ADMIN_BLOG_CATEGORIES.find((c) => c.id === id);
}

export function blogsInCategory(categoryId: string): BlogPost[] {
  return ADMIN_BLOGS.filter((b) => b.categoryId === categoryId);
}
