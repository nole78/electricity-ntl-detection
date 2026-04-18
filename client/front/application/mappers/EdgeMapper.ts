import { Edge } from "@/domain/models/Edge";
import { Feeder33DTO } from "../dto/Feeder33DTO";
import { Feeder33SubstationDTO } from "../dto/Feeder33SubstationDTO";
import { Feeder11DTO } from "../dto/Feeder11DTO";
import { DtDTO } from "../dto/DtDTO";

export class EdgeMapper {

  static fromFeeder33ToSubstations(
  feeder33: Feeder33DTO,
  links: Feeder33SubstationDTO[],
  dts: DtDTO[]
): Edge[] {

  // TS → SS
  const ssEdges: Edge[] = links
    .filter(l => l.feeders33Id === feeder33.id)
    .map(l => ({
      id: `33-${feeder33.id}-SS-${l.substationsId}`,
      from: `TS-${feeder33.tsId}`,
      to: `SS-${l.substationsId}`,
      voltage: "33KV"
    }));

  // TS → DT
  const dtEdges: Edge[] = dts
  .filter(dt => dt.feeder33Id === feeder33.id)
  .map((dt): Edge => ({
    id: `33-${feeder33.id}-DT-${dt.id}`,
    from: `TS-${feeder33.tsId}`,
    to: `DT-${dt.id}`,
    voltage: "33KV"
  }));

  return [...ssEdges, ...dtEdges];
}

  static fromFeeder11(
  feeder: Feeder11DTO,
  dts: DtDTO[]
  ): Edge[] {
    return dts
    .filter(dt => dt.feeder11Id === feeder.id)
    .map(dt => ({
      id: `11-${feeder.id}-${dt.id}`,
      from: feeder.ssId
        ? `SS-${feeder.ssId}`
        : `TS-${feeder.tsId}`,
      to: `DT-${dt.id}`,
      voltage: "11KV"
    }));
}
}