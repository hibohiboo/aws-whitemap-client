import { supabase } from "@/domain/supabase/clinet";
import { ToScene } from "../types";

interface NextScene {
  to_id: string
  to_name: string
  from_id: string
}

export const insertSceneLink = async (from_id: string, to_id: string, to_name: string) => {
  const { data, error } = await supabase
    .from<NextScene>('scene_link')
    .insert([
      { from_id, to_id, to_name },
    ])
}

export const updateSceneLink = async (to_id: string, to_name: string) => {
  const { data, error } = await supabase
    .from<NextScene>('scene_link')
    .update({ to_name })
    .eq('to_id', to_id)
}

export const selectSceneLink = async (from_id: string) => {

  const { data, error } = await supabase
    .from<NextScene>('scene_link')
    .select(`
    to_id,
    to_name
  `)
    .eq('from_id', from_id)


  if (error) {
    console.error('selectSceneLink failed', error)
  }
  return (data || []) as ToScene[]
}