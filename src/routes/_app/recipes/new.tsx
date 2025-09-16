import { createFileRoute, redirect } from '@tanstack/react-router'
import { CookingPotIcon, ScrollTextIcon } from 'lucide-react'
import { useState } from 'react'
import { useIsMobile } from '@/lib/hooks/use-mobile'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

export const Route = createFileRoute('/_app/recipes/new')({
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

type RecipeIngredients = {
  [key: string]: {
    quantity: number
    unit: string
  }
}

function RouteComponent() {
  const isMobile = useIsMobile()

  const [recipeTitle, setRecipeTitle] = useState('')
  const [recipeDescription, setRecipeDescription] = useState('')

  const [recipeIngredients, setRecipeIngredients] =
    useState<RecipeIngredients | null>(null)

  return (
    <section className="min-h-[calc(100vh-65px)] w-[clamp(20vw,1300px,100%)] justify-between py-12 px-8 lg:p-24 mx-auto flex-col flex gap-y-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-y-8">
          <input
            className="text-6xl font-bold text-foreground border-2 border-amber-500/30 rounded-md"
            value={recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
            max={30}
          />

          <textarea
            className="text-xl font-medium text-muted-foreground text-pretty resize-none border-amber-500/30 rounded-md border-2 flex-1 p-4"
            value={recipeDescription}
            onChange={(e) => setRecipeDescription(e.target.value)}
            maxLength={500}
          />
        </div>

        {!isMobile ? (
          // Desktop Version
          <div className="flex flex-col gap-y-4">
            <Avatar className="border-2 self-center border-amber-500/30 h-[clamp(300px,30vw,350px)] w-[clamp(300px,30vw,350px)] rounded-xl">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={'placeholder'}
              />
            </Avatar>
          </div>
        ) : (
          // Mobile Version
          <div className="flex flex-col gap-y-4">
            <Avatar className="border-2 border-amber-500/30 h-[clamp(150px,30vw,350px)] rounded-xl w-full">
              <AvatarImage
                className="rounded-none object-cover object-top"
                src={'placeholder'}
              />
            </Avatar>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center w-full gap-x-4 border-b-2 border-amber-500/30 pb-4">
            <CookingPotIcon className="size-9 text-amber-500 shrink-0" />
            <h2 className="text-4xl text-foreground font-bold">Ingredients</h2>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex items-center w-full gap-x-4 border-b-2 border-amber-500/30 pb-4">
            <ScrollTextIcon className="size-9 text-amber-500 shrink-0" />

            <h2 className="text-4xl text-foreground font-bold">Instructions</h2>
          </div>
          {/* 
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
          </div> */}
        </div>

        {/* {recipe.video_url && (
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
          </div> */}
        {/* )} */}
      </div>
    </section>
  )
}
