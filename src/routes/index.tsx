import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/providers/auth-provider'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { user } = useAuth()

  return (
    <div className="p-2">
      <h3>Bem-vindo à Plataforma de Receitas!</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
