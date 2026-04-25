export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface Article extends ArticleListItem {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
}
