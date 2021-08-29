import { supabase } from '@/domain/supabase/clinet';
import { Asiato } from '../types';

export const insertAsiato = async (
  uid: string,
  scene_id: string,
  scene_name: string,
) => {
  const { data, error } = await supabase
    .from<Asiato>('asiato')
    .insert([{ uid, scene_id, scene_name }]);
  if (data) {
    const [asiato] = data;
    return asiato;
  }
  return null;
};
