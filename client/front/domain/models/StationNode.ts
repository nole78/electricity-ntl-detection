import { VoltageLevel } from "../types/VoltageLevel";
import { Position } from "./Position";

export interface StationNode {
  id: string;
  name: string;
  type: VoltageLevel;

  latitude: number;   
  longitude: number;  

  position: Position; // canvas
}