export type MODE = "normal" | "insert" | "movement" | "visual";
export type DIR = "tl" | "bl" | "l" | "r" | "tr" | "br" | "t" | "b" | "";

// GraphMapId = "x,y_GraphNode.id"
export type GraphMapId = `${number},${number}_${string}`;

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  text: string;
  length: number;
  adj: Map<DIR, GraphMapId>;
  parentId: string;
  dir?: DIR; // direction w.r.t to the parent
}
