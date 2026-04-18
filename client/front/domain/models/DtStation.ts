import { TransmissionStation } from "./TransmissionStation";

export interface DtStation extends TransmissionStation {
  meterId?: number | string;
  feeder11Id?: number | string;
  feeder33Id?: number | string;
  nameplateRating?: number;
}
