import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { getProfileByUserID, getRecipesByUserID } from '@/services/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/lib/providers/auth-provider'
import { EditBio } from '@/components/profile/edit-bio'
import { Skeleton } from '@/components/ui/skeleton'
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
  const params = Route.useParams()
  const { user } = useAuth()

  const [isEditing, setIsEditing] = useState(false)

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
      <div className="w-[min(100%,1200px)] py-16 px-12 mx-auto flex-row flex">
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

  return (
    <div className="w-[clamp(20vw,1200px,100%)] py-16 px-12 mx-auto flex-col md:flex-row flex">
      <Avatar className="border-2 border-amber-500/30 h-[clamp(150px,40vw,250px)] w-[clamp(150px,40vw,250px)]">
        <AvatarImage src={profile.avatar_url} />
        <AvatarFallback className="text-4xl text-foreground bg-transparent">
          {profile.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col px-0 py-12 md:px-12">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-6xl font-bold text-foreground">{profile.name}</h1>

          {user.id === profile.user_id && (
            <EditBio
              userId={user.id}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </div>

        <div className="py-4 mb-10">
          {!isEditing && (
            <p className="text-xl text-foreground/85">{profile.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-4">
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.title} className="flex gap-x-4 items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500/30">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xl text-foreground font-bold">
                  {recipe.title}
                </p>
              </div>
            ))
          ) : (
            <p className="text-foreground font-bold">
              This user hasn't posted any recipe yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
