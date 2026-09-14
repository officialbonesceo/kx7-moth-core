import type { SeedArticle } from './types';
import { PART as A } from './part0';
import { PART as B } from './part1';
import { PART as C } from './part2';
export type { SeedArticle };
export const ARTICLES: SeedArticle[] = [...A, ...B, ...C];
