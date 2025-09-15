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
  upvotes: number
  created_at: string
}

export type Upvote = {
  id: string
  recipe_id: string
  user_id: string
  created_at: string
}

export type ToggleVoteResponse = {
  status: 'added' | 'removed'
} | null
