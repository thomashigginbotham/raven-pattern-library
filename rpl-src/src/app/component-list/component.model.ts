export interface WebComponent {
  id: string;
  name: string;
  summary: string;
  depends: string[];
  defaultDims: number[];
  background: string;
  html: string;
  demoHtml: string;
  variantsUri: string;
}
