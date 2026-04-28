import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/api"

// TYPES
type User = {
  _id: string
  name: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// CONTEXT
const AuthContext = createContext<AuthContextType | null>(null)

// PROVIDER
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔥 GET CURRENT USER (VERY IMPORTANT)
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true,
      })
      setUser(res.data.user)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // LOGIN
  const login = async (email: string, password: string) => {
    await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    )

    await fetchUser() // refresh user after login
  }

  // REGISTER
  const register = async (name: string, email: string, password: string) => {
    await api.post(
      "/auth/register",
      { name, email, password },
      { withCredentials: true }
    )

    await fetchUser()
  }

  // LOGOUT
  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true })
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// HOOK
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}