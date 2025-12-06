export interface Response {
  total: number;
  results: Result[];
}

interface Result {
  package: Package;
  score: Score;
  searchScore: number;
}

interface Package {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: Date;
  links: Links;
  publisher: Publisher;
  maintainers: Publisher[];
  author?: Author;
}

interface Author {
  name?: string;
  email: string;
  url?: string;
}

interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs: string;
}

interface Publisher {
  username: string;
  email: string;
}

interface Score {
  final: number;
  detail: Detail;
}

interface Detail {
  quality: number;
  popularity: number;
  maintenance: number;
}
