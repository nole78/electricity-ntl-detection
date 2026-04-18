import { Graph } from "@/domain/models/Graph";
import { DtDTO } from "../dto/DtDTO";
import { Feeder11DTO } from "../dto/Feeder11DTO";
import { Feeder33DTO } from "../dto/Feeder33DTO";
import { Feeder33SubstationDTO } from "../dto/Feeder33SubstationDTO";
import { SubstationDTO } from "../dto/SubstationDTO";
import { TransmissionStationDTO } from "../dto/TransmissionStationDTO";
import { NodeMapper } from "../mappers/NodeMapper";
import { EdgeMapper } from "../mappers/EdgeMapper";

export class GraphBuilder {

  static build(
    ts: TransmissionStationDTO[],
    ss: SubstationDTO[],
    dt: DtDTO[],
    f11: Feeder11DTO[],
    f33: Feeder33DTO[],
    links: Feeder33SubstationDTO[]
  ): Graph {

    const nodes = [
      ...ts.map(NodeMapper.fromTransmission),
      ...ss.map(NodeMapper.fromSubstation),
      ...dt.map(NodeMapper.fromDt),
    ];

    const edges = [
      // 33kV
      ...f33.flatMap(f => 
        EdgeMapper.fromFeeder33ToSubstations(f, links, dt)
      ),

      // 11kV
      ...f11.flatMap(f => 
        EdgeMapper.fromFeeder11(f, dt)
      )
    ];

    return { nodes, edges };
  }
}