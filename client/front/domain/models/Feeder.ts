import { FeederVoltage } from "../enums/FeederVoltage";

export interface Feeder {
  id: string;
  name: string;
  voltage: FeederVoltage;
  from: string;
  to: string;
}