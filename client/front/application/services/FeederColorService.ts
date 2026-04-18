import { FeederVoltage } from "@/domain/types/FeederVoltage";

export class FeederColorService {
  static getColor(voltage: string) {
    switch (voltage) {
      case "33kV": return "red";
      case "11kV": return "blue";
      default: return "gray";
    }
  }
}