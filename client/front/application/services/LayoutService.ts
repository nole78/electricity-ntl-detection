// application/services/LayoutService.ts

import { Node } from "../../domain/models/Node";

export interface LayoutResult {
  nodes: Node[];
  scale: number;
  offsetX: number;
  offsetY: number;
}

export class LayoutService {

  static layout(
    nodes: Node[],
    width: number,
    height: number,
    padding: number = 50
  ): LayoutResult {

    if (nodes.length === 0) {
      return {
        nodes: [],
        scale: 1,
        offsetX: 0,
        offsetY: 0
      };
    }

    // bounding box
    const xs = nodes.map(n => n.position.x);
    const ys = nodes.map(n => n.position.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    // scale da stane u canvas
    const scaleX = (width - padding * 2) / graphWidth;
    const scaleY = (height - padding * 2) / graphHeight;

    const scale = Math.min(scaleX, scaleY);

    // centering
    const offsetX =
      width / 2 - ((minX + maxX) / 2) * scale;

    const offsetY =
      height / 2 - ((minY + maxY) / 2) * scale;

    // apply transformation
    const transformedNodes = nodes.map(n => ({
      ...n,
      position: {
        x: n.position.x * scale + offsetX,
        y: n.position.y * scale + offsetY
      }
    }));

    return {
      nodes: transformedNodes,
      scale,
      offsetX,
      offsetY
    };
  }
}