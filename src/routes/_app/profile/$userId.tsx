import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, CalendarIcon, PlusIcon, ThumbsUp } from 'lucide-react'
import { getProfileByUserID, getRecipesByUserID } from '@/services/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/providers/auth-provider'
import { EditBio } from '@/components/profile/edit-bio'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import logo from '@/assets/logo.png'

export const Route = createFileRoute('/_app/profile/$userId')({
  beforeLoad({ context }) {
    const { user, loading } = context.auth

    if (!user && !loading) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()
  const params = Route.useParams()

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ['profile', params.userId],
    queryFn: () => getProfileByUserID(params.userId),
  })

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: ['recipes', params.userId],
    queryFn: () => getRecipesByUserID(params.userId),
  })

  if (isLoadingProfile || isLoadingRecipes) {
    return (
      <div className="w-[min(100%,1300px)] py-16 px-12 mx-auto flex-row flex">
        <div className="flex flex-row">
          <Skeleton className="h-[250px] w-[250px] rounded-xl" />
          <div className="flex-1 flex flex-col gap-4 p-10">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  if (isErrorProfile || isErrorRecipes || !profile || !user) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center gap-y-4">
        <img src={logo} alt="logo" className="h-16 aspect-square" />

        <p className="text-2xl font-bold text-foreground">
          Usuário não encontrado.
        </p>

        <Link className="text-amber-400 flex items-center gap-x-2" to="/">
          <ArrowLeft className="size-5" />
          Voltar para o início
        </Link>
      </div>
    )
  }

  const isCurrentUser = user.id === profile.user_id

  return (
    <section className="w-[clamp(20vw,1300px,100%)] py-16 px-12 mx-auto flex-col md:flex-row flex gap-x-6">
      <div className="relative h-[clamp(150px,40vw,250px)] w-[clamp(150px,40vw,250px)]">
        <Avatar className="relative border-2 border-amber-500/30 size-full">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-4xl text-foreground bg-transparent">
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="absolute z-20 text-foreground border border-amber-500/30 hover:border-amber-500/40 hover:bg-amber-500/20 transition-colors duration-150 rounded-full bottom-5 right-5 p-1 bg-amber-500/10 backdrop-blur-sm">
          <PlusIcon className="size-7 text-amber-500 stroke-1 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-0 py-12 md:px-12 gap-y-8">
        <div>
          <h1 className="text-7xl font-bold text-foreground">{profile.name}</h1>

          {isCurrentUser && (
            <EditBio
              userId={user.id}
              currentBio={profile.bio}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}

          <div className="mt-4 mb-10 border-l-2 pl-4 border-amber-500/30">
            {!isEditing && (
              <p className="text-lg text-foreground/85">{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-8">
          <div className="flex justify-between w-full">
            {isCurrentUser ? (
              <h2 className="text-4xl text-foreground font-bold">My recipes</h2>
            ) : (
              <h2 className="text-4xl text-foreground font-bold">
                Recipes by {profile.name}
              </h2>
            )}

            {isCurrentUser && (
              <div className="flex self-end gap-x-1 items-center group">
                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-all duration-150 group-hover:underline cursor-pointer font-semibold">
                  Create new recipe
                </p>

                <button className="text-muted-foreground cursor-pointer group-hover:text-foreground/80 transition-all duration-150 group-hover:border-foreground/80">
                  <PlusIcon className="size-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4">
              {recipes && recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <Link
                    key={`${recipe.id}-${index}`}
                    to={`/recipes/$recipeId`}
                    params={{ recipeId: recipe.id }}
                    className={cn(
                      'flex gap-x-4 items-center justify-between flex-1 px-4 py-3 rounded-lg cursor-pointer',
                      'hover:bg-amber-600/10 transition-all duration-150 border-amber-500/30 border',
                    )}
                  >
                    <div className="flex items-center gap-x-2.5">
                      <div className="size-10 rounded-full overflow-hidden bg-amber-500/30">
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <p className="text-xl font-bold text-foreground">
                        {recipe.title}
                      </p>

                      <span className="text-amber-500/30">|</span>

                      <div className="flex gap-x-1.5 items-center">
                        <ThumbsUp className="size-4  text-amber-500" />
                        <p className="text-foreground font-semibold">
                          {recipe.upvotes}
                        </p>
                      </div>
                    </div>

                    <p className="text-amber-500/80 font-semibold italic tracking-wide flex items-center gap-x-3">
                      {new Date(recipe.created_at).toLocaleDateString()}
                      <CalendarIcon className="size-4 shrink-0" />
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground font-semibold italic">
                  This user hasn't posted any recipe yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
