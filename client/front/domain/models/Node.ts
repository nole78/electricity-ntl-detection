import { VoltageLevel } from "../enums/VoltageLevel";

export interface Node {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: VoltageLevel;
}