import { FeederVoltage } from "../types/FeederVoltage";

export interface Feeder {
  id: string;
  name: string;
  voltage: FeederVoltage;
  from: string;
  to: string;
}