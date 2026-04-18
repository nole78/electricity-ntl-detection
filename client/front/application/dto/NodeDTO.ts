import { VoltageLevel } from "@/domain/enums/VoltageLevel";

export interface NodeDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: VoltageLevel;
}