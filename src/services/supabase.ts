import { createClient } from '@supabase/supabase-js'
import type {
  Recipe,
  ToggleVoteResponse,
  UserProfile,
} from '@/lib/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

export async function toggleUpvote(
  recipeId: string,
  userId: string,
): Promise<ToggleVoteResponse> {
  const { error: deleteError, data: deleted } = await supabase
    .from('recipe_votes')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)
    .select()

  if (!deleteError && deleted.length > 0) {
    return { status: 'removed' }
  }

  const { error: insertError, data: inserted } = await supabase
    .from('recipe_votes')
    .insert({
      user_id: userId,
      recipe_id: recipeId,
    })
    .select()

  if (!insertError && inserted.length > 0) {
    return { status: 'added' }
  }

  throw insertError ?? deleteError
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
      .select('title, description, user_id, image_url, upvotes, created_at')
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
      .select('id, title, description, image_url, upvotes, created_at')
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
        'title, description, ingredients, instructions, user_id, image_url, video_url, upvotes, created_at',
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
