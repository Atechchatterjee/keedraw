export type MODE = "normal" | "insert" | "movement" | "visual";
export type DIR = "tl" | "bl" | "l" | "r" | "tr" | "br" | "t" | "b" | "";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  text: string;
  length: number;
  children: GraphNode[];
  dir?: DIR;
}
