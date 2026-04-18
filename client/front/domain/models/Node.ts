import { VoltageLevel } from "../enums/VoltageLevel";
import { Position } from "./Position";

export interface Node {
  id: string;
  name: string;
  type: VoltageLevel;
  position: Position;
}