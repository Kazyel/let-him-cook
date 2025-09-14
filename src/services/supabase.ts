import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

export type UserProfile = {
  user_id: string
  name: string
  bio: string
  avatar_url: string
  created_at: string
}

export type Recipe = {
  id: string
  title: string
  description: string
  ingredients: Array<string>
  instructions: Array<string>
  user_id: string
  image_url: string
  video_url: string
  created_at: string
}

export async function getProfileByUserID(uuid: string) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('profiles')
      .select('user_id, name, bio, avatar_url, created_at')
      .eq('user_id', uuid)
      .single()

    if (error) {
      console.error('Erro ao buscar o usuário:', error.message)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Erro inesperado:', error)
    return null
  }
}

export async function getPaginatedRecipes(page: number) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('recipes')
      .select('title, description, user_id, image_url, created_at')
      .order('created_at', { ascending: false })
      .range(page * 10, page * 10 + 10)

    if (error) {
      console.error('Erro ao buscar as receitas:', error.message)
      return null
    }

    return data as Array<
      Omit<Recipe, 'instructions' | 'ingredients' | 'video_url'>
    >
  } catch (error) {
    console.error('Erro inesperado:', error)
    return null
  }
}

export async function getRecipesByUserID(uuid: string) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('recipes')
      .select('id, title, description, image_url, created_at')
      .eq('user_id', uuid)
      .limit(10)

    if (error) {
      console.error('Erro ao buscar a receita:', error.message)
      return null
    }

    return data as Array<
      Omit<Recipe, 'instructions' | 'ingredients' | 'video_url'>
    >
  } catch (error) {
    console.error('Erro inesperado:', error)
    return null
  }
}

export async function getSingleRecipeById(id: string) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('recipes')
      .select(
        'title, description, ingredients, instructions, user_id, image_url, video_url, created_at',
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar a receita:', error.message)
      return null
    }

    return data as Recipe
  } catch (error) {
    console.error('Erro inesperado:', error)
    return null
  }
}

export default supabase
