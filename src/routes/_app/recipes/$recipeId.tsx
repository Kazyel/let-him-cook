import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createFileRoute } from '@tanstack/react-router'
import { CookingPotIcon, ScrollTextIcon, ThumbsUp } from 'lucide-react'
import supabase, { getSingleRecipeById } from '@/lib/services/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useIsMobile } from '@/lib/hooks/use-mobile'
import { cn, getEmbedUrl } from '@/lib/utils'
import { useAuth } from '@/lib/providers/auth-provider'
import { useToggleVote } from '@/lib/hooks/use-toggle-vote'

export const Route = createFileRoute('/_app/recipes/$recipeId')({
  component: RouteComponent,
})

async function fetchHasUpvoted(recipeId: string, userId: string) {
  const { count, error } = await supabase
    .from('recipe_votes')
    .select('*', { count: 'exact', head: true })
    .eq('recipe_id', recipeId)
    .eq('user_id', userId)

  if (error) throw error
  return (count ?? 0) > 0
}

function RouteComponent() {
  const params = Route.useParams()
  const isMobile = useIsMobile()
  const { user } = useAuth()

  const { data: recipe, isLoading: isLoadingRecipes } = useQuery({
    queryKey: ['recipe', params.recipeId],
    queryFn: () => getSingleRecipeById(params.recipeId),
  })

  const { data: hasUpvoted } = useQuery({
    queryKey: ['hasUpvoted', params.recipeId, user?.id],
    queryFn: () => fetchHasUpvoted(params.recipeId, user!.id),
    enabled: !!user,
  })

  const upvote = useToggleVote()

  if (isLoadingRecipes) {
    return <div>Loading...</div>
  }

  if (!recipe) {
    return <div>Not found!</div>
  }

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para votar.')
      return
    }

    await upvote(params.recipeId, user.id)
  }

  return (
    <section className="min-h-[calc(100vh-65px)] w-[clamp(20vw,1300px,100%)] justify-between py-12 px-8 lg:p-24 mx-auto flex-col flex gap-y-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-y-4">
          <h1 className="text-6xl font-bold text-foreground">{recipe.title}</h1>

          <h2 className="pl-2 text-xl font-medium text-muted-foreground text-pretty">
            {recipe.description}
          </h2>
        </div>

        {!isMobile ? (
          // Desktop Version
          <div className="flex flex-col gap-y-4">
            <Avatar className="border-2 self-center border-amber-500/30 h-[clamp(300px,30vw,350px)] w-[clamp(300px,30vw,350px)] rounded-xl">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={recipe.image_url}
              />
              <AvatarFallback className="text-4xl text-foreground bg-transparent">
                {recipe.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={handleUpvote}
              className={cn(
                'w-fit p-2 rounded-md cursor-pointer flex items-center gap-x-2',
                'hover:bg-amber-600/10 transition-all duration-150 hover:border-amber-500/30 border border-transparent',
                hasUpvoted && 'bg-amber-600/10 border-amber-500/30',
              )}
            >
              <ThumbsUp className="size-9  text-amber-500" />

              <span className="text-foreground text-2xl font-bold">
                {recipe.upvotes}
              </span>
            </button>
          </div>
        ) : (
          // Mobile Version
          <div className="flex flex-col gap-y-4">
            <Avatar className="border-2 border-amber-500/30 h-[clamp(150px,30vw,350px)] rounded-xl w-full">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={recipe.image_url}
              />
              <AvatarFallback className="text-4xl text-foreground bg-transparent">
                {recipe.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={handleUpvote}
              className={cn(
                'w-fit p-2 rounded-md cursor-pointer flex items-center gap-x-2',
                'hover:bg-amber-600/10 transition-all duration-150 hover:border-amber-500/30 border border-transparent',
                hasUpvoted && 'bg-amber-600/10 border-amber-500/30',
              )}
            >
              <ThumbsUp className="size-9  text-amber-500" />

              <span className="text-foreground text-2xl font-bold">
                {recipe.upvotes}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center w-full gap-x-4 border-b-2 border-amber-500/30 pb-4">
            <CookingPotIcon className="size-9 text-amber-500 shrink-0" />
            <h2 className="text-4xl text-foreground font-bold">Ingredients</h2>
          </div>

          <div className="flex flex-col gap-y-6 pl-8 mt-2">
            <ul className="flex flex-col gap-y-2 list-disc">
              {recipe.ingredients.map((ingredient: string) => (
                <li
                  key={ingredient}
                  className="text-xl text-foreground/85 font-bold"
                >
                  {ingredient}.
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center w-full gap-x-4 border-b-2 border-amber-500/30 pb-4">
            <ScrollTextIcon className="size-9 text-amber-500 shrink-0" />

            <h2 className="text-4xl text-foreground font-bold">Instructions</h2>
          </div>

          <div className="flex flex-col gap-y-6 pl-8 mt-2">
            <ul className="flex flex-col gap-y-2 list-decimal">
              {recipe.instructions.map((instruction: string) => (
                <li
                  key={instruction}
                  className="text-xl text-foreground/85 font-bold"
                >
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {recipe.video_url && (
          <div className="flex flex-col gap-y-4">
            <div className="flex items-center w-full gap-x-4 border-b-2 border-amber-500/30 pb-4">
              <CookingPotIcon className="size-9 text-amber-500 shrink-0" />
              <h2 className="text-4xl text-foreground font-bold">
                Video Tutorial
              </h2>
            </div>

            <iframe
              className="w-full h-[clamp(300px,30vw,500px)] rounded-xl mt-2"
              src={getEmbedUrl(recipe.video_url)}
              title="Video Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </section>
  )
}
