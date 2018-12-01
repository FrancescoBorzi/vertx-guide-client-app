export interface Response {
  success: boolean;
}

export interface Page {
  id: number;
  name: string;
  markdown?: string;
  html?: string;
}

export interface PageResponse extends Response {
  page: Page;
}

export interface PagesResponse extends Response {
  pages: Page[];
}
