import { Link } from '@tanstack/react-router'
import { LoginButton } from './login-button'
import { AvatarDropdown } from './avatar-dropdown'
import { useAuth } from '@/lib/providers/auth-provider'

export function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="flex justify-between items-center p-2 border-b border-black/25 bg-white text-black">
      <Link to="/" className="text-xl font-bold tracking-tighter ">
        Let him cook.
      </Link>

      {user ? <AvatarDropdown /> : <LoginButton />}
    </nav>
  )
}
