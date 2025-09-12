import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/profile/')({
  component: ProfileComponent,
  beforeLoad({ context }) {
    const { user, loading } = context.auth

    if (!user && !loading) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
})

function ProfileComponent() {
  return <div>Hello "/profile"!</div>
}
