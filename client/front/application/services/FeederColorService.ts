import { FeederVoltage } from "@/domain/types/FeederVoltage";

export class FeederColorService {
  static getColor(voltage: string) {
    switch (voltage) {
      case "33KV": return "red";
      case "11KV": return "blue";
      default: return "gray";
    }
  }
}