export interface Room {
  title: string;
  roomId: string;
  tags: string;
  scenarioTitle: string;
  scenarioUrl: string;
  materials: {
    name: string;
    url: string;
  }[];
}
