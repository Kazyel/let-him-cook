import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CookingPotIcon, ScrollTextIcon } from 'lucide-react'
import { getSingleRecipeById } from '@/services/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useIsMobile } from '@/lib/hooks/use-mobile'
import { getEmbedUrl } from '@/lib/utils'

export const Route = createFileRoute('/_app/recipes/$recipeId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const isMobile = useIsMobile()

  const { data: recipe, isLoading: isLoadingRecipes } = useQuery({
    queryKey: ['recipe', params.recipeId],
    queryFn: () => getSingleRecipeById(params.recipeId),
  })

  if (isLoadingRecipes) {
    return <div>Loading...</div>
  }

  if (!recipe) {
    return <div>Not found!</div>
  }

  return (
    <div className="min-h-[calc(100vh-65px)] w-[clamp(20vw,1300px,100%)] justify-between py-12 px-8 lg:p-24 mx-auto flex-row flex">
      <div className="flex flex-col gap-y-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-6xl font-bold text-foreground">
              {recipe.title}
            </h1>
            <h2 className="pl-2 text-xl font-medium text-muted-foreground text-pretty">
              {recipe.description}
            </h2>
          </div>

          {!isMobile ? (
            <Avatar className="border-2 self-center border-amber-500/30 h-[clamp(300px,30vw,350px)] w-[clamp(300px,30vw,350px)] rounded-xl">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={recipe.image_url}
              />
              <AvatarFallback className="text-4xl text-foreground bg-transparent">
                {recipe.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="border-2 border-amber-500/30 h-[clamp(150px,30vw,350px)] rounded-xl w-full">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={recipe.image_url}
              />
              <AvatarFallback className="text-4xl text-foreground bg-transparent">
                {recipe.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

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

        <div className="flex flex-col gap-y-4 mt-6">
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
    </div>
  )
}
