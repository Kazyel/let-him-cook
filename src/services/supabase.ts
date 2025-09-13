import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

export async function getProfileByUserID(uuid: string) {
  try {
    const { data, error } = await supabase
      .schema('public')
      .from('profiles')
      .select('user_id, name, bio, avatar_url')
      .eq('user_id', uuid)
      .single()

    if (error) {
      console.error('Erro ao buscar o usuário:', error.message)
      return null
    }

    return data
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
      .select(
        'title, description, ingredients, instructions, user_id, image_url, created_at',
      )
      .order('created_at', { ascending: false })
      .range(page * 10, page * 10 + 10)

    if (error) {
      console.error('Erro ao buscar as receitas:', error.message)
      return null
    }

    return data
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
      .select('title, description, image_url')
      .eq('user_id', uuid)
      .limit(10)

    if (error) {
      console.error('Erro ao buscar a receita:', error.message)
      return null
    }

    return data
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
        'title, description, ingredients, instructions, user_id, image_url, created_at',
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar a receita:', error.message)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro inesperado:', error)
    return null
  }
}

export default supabase
