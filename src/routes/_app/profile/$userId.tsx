import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/$userId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      userId: params.userId,
    }
  },
})

function RouteComponent() {
  const { userId } = Route.useParams()

  return <div>Hello, this profile is for userId "{userId}"!</div>
}
