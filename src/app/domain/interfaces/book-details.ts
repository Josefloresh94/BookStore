import { Book } from './book';

export interface BookDetails extends Book {
  authors: string;
  publisher: string;
  pages: string;
  year: string;
  rating: string;
  desc: string;
  pdf?: Record<string, string>;
}
