import supabase from '@/services/supabase'

export function LogoutButton() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  )
}
