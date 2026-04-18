import { DtDTO } from "../dto/DtDTO";
import { SubstationDTO } from "../dto/SubstationDTO";
import { TransmissionStationDTO } from "../dto/TransmissionStationDTO";
import { StationNode } from "@/domain/models/StationNode";

export class NodeMapper {

  static fromTransmission(dto: TransmissionStationDTO): StationNode {

  return {
    id: `TS-${dto.id}`,
    name: dto.name,
    type: "TS",

    latitude: dto.latitude,    
    longitude: dto.longitude   
  };
}

  static fromSubstation(dto: SubstationDTO): StationNode {

    return {
      id: `SS-${dto.id}`,
      name: dto.name,
      type: "SS",
      latitude: dto.latitude,
      longitude: dto.longitude
    };
  }

  static fromDt(dto: DtDTO): StationNode {

    return {
      id: `DT-${dto.id}`,
      name: dto.name,
      type: "DT",
      latitude: dto.latitude,
      longitude: dto.longitude
    };
  }
}