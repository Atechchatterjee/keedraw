import { DIR, GraphMapId, GraphNode } from "./type";

export function createGraphMapId(
  graphNode: GraphNode | { x: number; y: number; id: string }
): GraphMapId {
  return `${graphNode.x},${graphNode.y}_${graphNode.id}`;
}

/**
 *
 * @returns a unique identifier created using the current datetime
 */
export function generateGraphIds(): string {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
}

/**
 * @param box: expects the parent GraphNode
 * @param newChild: expects a direction and graph map id for the child GraphNode
 * @returns box: returns the modifed parent box
 * @description adds a child GraphNode to a given parent GraphNode
 * */
export function addEdge(box: GraphNode, newChild: GraphNode) {
  let boxAdj = new Map(box.adj);
  boxAdj.set(newChild.dir, createGraphMapId(newChild));
  let modifiedFocusedBox: GraphNode = {
    ...box,
    adj: boxAdj,
  };
  return modifiedFocusedBox;
}

export function getOppositeDir(dir: DIR): DIR {
  const oppositeDirections = new Map<DIR, DIR>();
  (
    [
      ["t", "b"],
      ["l", "r"],
      ["tl", "br"],
      ["tr", "bl"],
    ] as [d1: DIR, d2: DIR][]
  ).forEach(([d1, d2]) => {
    oppositeDirections.set(d1, d2);
    oppositeDirections.set(d2, d1);
  });

  return oppositeDirections.get(dir) ?? "";
}

/**
 *
 * @description finds the direction of "u" w.r.t "v"
 * @param coordinates the x, y value for the current/to be created GraphNode
 * @param v reference GraphNode
 * @returns direction (DIR)
 */
export function getRelativeDirection(
  coordinates: { x: number; y: number },
  v: GraphNode | undefined
) {
  if (v) {
    const normalizedX = coordinates.x - v.x,
      normalizedY = -(coordinates.y - v.y);

    if (normalizedX === 0 && normalizedY > 0) return "t";
    else if (normalizedX < 0 && normalizedY > 0) return "tl";
    else if (normalizedX > 0 && normalizedY > 0) return "tl";
    else if (normalizedX === 0 && normalizedY < 0) return "b";
    else if (normalizedX < 0 && normalizedY < 0) return "bl";
    else if (normalizedX > 0 && normalizedY < 0) return "br";
    else if (normalizedX > 0 && normalizedY === 0) return "r";
    else if (normalizedX < 0 && normalizedY === 0) return "l";
    else return "";
  }
  return "";
}
