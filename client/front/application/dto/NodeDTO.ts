import { VoltageLevel } from "@/domain/types/VoltageLevel";

export interface NodeDTO {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: VoltageLevel;
}