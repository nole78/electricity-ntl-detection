export interface Edge {
  id: string;
  from: string;
  to: string;
  voltage: "11kV" | "33kV";
}