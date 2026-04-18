import { FeederVoltage } from "../types/FeederVoltage";

export interface Edge {
  id: string;
  from: string;
  to: string;
  voltage: FeederVoltage;
}