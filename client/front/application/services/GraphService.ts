import { Graph } from "@/domain/models/Graph";
import { GraphBuilder } from "./GraphBuilder";

export class GraphService {
  static async getGraph(): Promise<Graph> {
    const data = await fetch("/api/graph").then(r => r.json());

    return GraphBuilder.build(
      data.transmissionStations,
      data.substations,
      data.dt,
      data.feeder11,
      data.feeder33,
      data.links
    );
  }
}
