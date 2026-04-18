export class ProjectionService {
  static project(lat: number, lon: number) {
    return {
      x: lon * 10000,
      y: -lat * 10000
    };
  }
}