import { FeederVoltage } from "@/domain/enums/FeederVoltage";

export class FeederColorService {
    private static voltageColorMap: Record<FeederVoltage, string> = {
        [FeederVoltage.HV]: "#ff3b30", // red
        [FeederVoltage.MV]: "#007aff"   // blue
    };

    static getColor(voltage: FeederVoltage): string {
        return this.voltageColorMap[voltage] ?? "#8e8e93"; // fallback gray
    }
}