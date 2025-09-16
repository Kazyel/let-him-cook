import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPaginatedRecipes } from '@/lib/services/supabase'

export const Route = createFileRoute('/_app/recipes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState<number>(0)

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: ['recipes', currentPage],
    queryFn: () => getPaginatedRecipes(currentPage),
  })

  if (isLoadingRecipes || isErrorRecipes) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <pre className="text-foreground">{JSON.stringify(recipes, null, 2)}</pre>
    </div>
  )
}
