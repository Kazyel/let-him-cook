import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/nav/navbar'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
