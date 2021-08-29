export interface Asiato {
  uid: string;
  scene_id: string;
  scene_name: string;
  created_at: Date;
}
export interface AsiatoRepository {
  insert: (
    asiatoList: Asiato[],
    uid: string,
    scene_id: string,
    scene_name: string,
  ) => Promise<Asiato[]>;
  getList: () => Asiato[];
}
