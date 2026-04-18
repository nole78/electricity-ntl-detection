import { Edge } from "@/domain/models/Edge";
import { Feeder33DTO } from "../dto/Feeder33DTO";
import { Feeder33SubstationDTO } from "../dto/Feeder33SubstationDTO";
import { Feeder11DTO } from "../dto/Feeder11DTO";

export class EdgeMapper {

  static fromFeeder33ToSubstations(
    feeder33: Feeder33DTO,
    links: Feeder33SubstationDTO[]
  ): Edge[] {

    return links
      .filter(l => l.feeders33Id === feeder33.id)
      .map(l => ({
        id: `33-${feeder33.id}-${l.substationsId}`,
        from: `TS-${feeder33.tsId}`,
        to: `SS-${l.substationsId}`,
        voltage: "33KV"
      }));
  }

  static fromFeeder11(dto: Feeder11DTO): Edge {
    return {
      id: `11-${dto.id}`,
      from: `SS-${dto.ssId}`,
      to: `DT-${dto.id}`, // ili posebna veza ako imaš mapping
      voltage: "11KV"
    };
  }
}