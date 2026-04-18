import { VoltageLevel } from "../types/VoltageLevel";

export interface StationNode {
  id: string;
  name: string;
  type: VoltageLevel;

  latitude: number;   
  longitude: number;  
}