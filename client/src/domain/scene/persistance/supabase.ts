import { supabase } from "@/domain/supabase/clinet";

export const insertSceneLink = async (from: string, to: string) => {
  const { data, error } = await supabase
    .from('scene_link')
    .insert([
      { from, to },
    ])
}
