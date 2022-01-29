export interface Crawler<T> {
  crawl: () => Promise<T[]>;
  name: string;
}
