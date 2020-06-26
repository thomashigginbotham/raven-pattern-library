export interface WebComponent {
  id: string;
  name: string;
  summary: string;
  depends: string[];
  defaultDims: number[];
  background: string;
  options: object[];
  html: string;
  demoHtml: string;
  variantsUri: string;
}
