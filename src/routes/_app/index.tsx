import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: App,
})

function App() {
  return (
    <>
      <div className="p-2 text-foreground">
        <h3>Bem-vindo à Plataforma de Receitas!</h3>
      </div>
    </>
  )
}
