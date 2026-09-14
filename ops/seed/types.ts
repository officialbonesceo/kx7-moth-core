export type SeedArticle = {
  slug: string;
  title: string;
  summary: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides';
  series: string;
  part: number;
  content: string;
  reading_minutes: number;
};
