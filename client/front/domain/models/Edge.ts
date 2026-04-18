import { FeederVoltage } from "../enums/FeederVoltage";

export interface Edge {
  id: string;
  from: string;
  to: string;
  voltage: FeederVoltage;
}