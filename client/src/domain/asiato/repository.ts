import * as ls from './persistance/localStorage';
import { insertAsiato } from './persistance/supabase';
import { Asiato, AsiatoRepository } from './types';

export const asiatoRepository: AsiatoRepository = {
  insert: async (
    asiatoList: Asiato[],
    uid: string,
    scene_id: string,
    scene_name: string,
  ) => {
    const asiato = await insertAsiato(uid, scene_id, scene_name);
    if (!asiato) throw new Error('insert asiato failed supabase');
    const ret = ls.insertQueue(asiatoList, asiato);
    ls.updateAsiato(ret);
    return ret;
  },
  getList: ls.getAsiatoList,
};
