import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { getSingleRecipeById } from '@/services/supabase'

export const Route = createFileRoute('/_app/recipes/$recipeId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: ['recipe', params.recipeId],
    queryFn: () => getSingleRecipeById(params.recipeId),
  })

  if (isLoadingRecipes || isErrorRecipes) {
    return <div>Loading...</div>
  }

  return <p className="text-foreground">{JSON.stringify(recipes, null, 2)}</p>
}
