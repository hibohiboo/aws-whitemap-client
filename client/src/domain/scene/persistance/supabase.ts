import { supabase } from "@/domain/supabase/clinet";

export const insertSceneLink = async (from_id: string, to_id: string, to_name: string) => {
  const { data, error } = await supabase
    .from('scene_link')
    .insert([
      { from_id, to_id, to_name },
    ])
}

export const updateSceneLink = async (to_id: string, to_name: string) => {
  const { data, error } = await supabase
    .from('scene_link')
    .update({ to_name })
    .eq('to_id', to_id)
}