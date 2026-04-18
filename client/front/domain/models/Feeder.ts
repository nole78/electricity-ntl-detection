export interface Feeder {
  id: string;
  name: string;
  voltage: "11kV" | "33kV";
  from: string;
  to: string;
}