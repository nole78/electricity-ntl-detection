import { EdgeDTO } from "../dto/EdgeDTO";
import { NodeDTO } from "../dto/NodeDTO";

export class GraphService {
  static buildGraph(nodes: NodeDTO[], edges: EdgeDTO[]) {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    return edges.map(e => ({
      ...e,
      from: nodeMap.get(e.fromId),
      to: nodeMap.get(e.toId)
    }));
  }
}