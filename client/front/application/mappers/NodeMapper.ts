import { DtDTO } from "../dto/DtDTO";
import { SubstationDTO } from "../dto/SubstationDTO";
import { TransmissionStationDTO } from "../dto/TransmissionStationDTO";
import { ProjectionService } from "../services/ProjectionService";
import { StationNode } from "@/domain/models/StationNode";

export class NodeMapper {

  static fromTransmission(dto: TransmissionStationDTO): StationNode {
  const pos = ProjectionService.project(dto.latitude, dto.longitude);

  return {
    id: `TS-${dto.id}`,
    name: dto.name,
    type: "TS",

    latitude: dto.latitude,    
    longitude: dto.longitude,   

    position: pos
  };
}

  static fromSubstation(dto: SubstationDTO): StationNode {
    const pos = ProjectionService.project(dto.latitude, dto.longitude);

    return {
      id: `SS-${dto.id}`,
      name: dto.name,
      type: "SS",
      latitude: dto.latitude,
      longitude: dto.longitude,
      position: pos
    };
  }

  static fromDt(dto: DtDTO): StationNode {
    const pos = ProjectionService.project(dto.latitude, dto.longitude);

    return {
      id: `DT-${dto.id}`,
      name: dto.name,
      type: "DT",
      latitude: dto.latitude,
      longitude: dto.longitude,
      position: pos
    };
  }
}