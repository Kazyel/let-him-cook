import { Link } from '@tanstack/react-router'
import { LoginButton } from './login-button'
import { LogoutButton } from './logout-button'
import { useAuth } from '@/providers/auth-provider'

export function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="flex justify-between items-center p-2 border-b border-black/25 bg-white text-black">
      <Link to="/" className="flex-1 text-xl font-bold tracking-tighter ">
        Let him cook.
      </Link>
      {user ? <LogoutButton /> : <LoginButton />}
    </nav>
  )
}
