import { DtDTO } from "../dto/DtDTO";
import { SubstationDTO } from "../dto/SubstationDTO";
import { TransmissionStationDTO } from "../dto/TransmissionStationDTO";
import { ProjectionService } from "../services/ProjectionService";
import { Node } from "@/domain/models/Node";

export class NodeMapper {

  static fromTransmission(dto: TransmissionStationDTO): Node {
    const pos = ProjectionService.project(dto.latitude, dto.longitude);

    return {
      id: `TS-${dto.id}`,
      name: dto.name,
      type: "TS",
      position: pos
    };
  }

  static fromSubstation(dto: SubstationDTO): Node {
    const pos = ProjectionService.project(dto.latitude, dto.longitude);

    return {
      id: `SS-${dto.id}`,
      name: dto.name,
      type: "SS",
      position: pos
    };
  }

  static fromDt(dto: DtDTO): Node {
    const pos = ProjectionService.project(dto.latitude, dto.longitude);

    return {
      id: `DT-${dto.id}`,
      name: dto.name,
      type: "DT",
      position: pos
    };
  }
}