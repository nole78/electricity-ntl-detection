import { Edge } from "./Edge";
import { StationNode } from "./StationNode";

export interface Graph {
  nodes: StationNode[];
  edges: Edge[];
}