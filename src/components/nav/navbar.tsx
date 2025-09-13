import { Link } from '@tanstack/react-router'
import logo from '../../assets/logo.png'
import { LoginButton } from './login-button'
import { AvatarDropdown } from './avatar-dropdown'
import { useAuth } from '@/lib/providers/auth-provider'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user } = useAuth()

  return (
    <nav
      className={cn(
        'flex justify-between items-center py-3 px-4 border-b border-black/15 bg-white text-foreground',
        'border-foreground/15 dark:bg-black',
      )}
    >
      <div className="flex items-center gap-x-2.5">
        <Link to="/">
          <img src={logo} alt="logo" className="h-9 aspect-square"></img>
        </Link>

        <div className="opacity-35 text-xl font-bold">/</div>

        <p className="text-xl font-bold tracking-tighter">Let him cook.</p>
      </div>

      <div className="flex items-center gap-x-4">
        {user ? <AvatarDropdown /> : <LoginButton />}
      </div>
    </nav>
  )
}
