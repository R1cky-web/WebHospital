import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()
const AUTH_KEY = 'hospital_huacho_auth'
const USERS_KEY = 'hospital_huacho_users'

const defaultUsers = [
  { id: 1, name: 'Admin Hospital', email: 'admin@hospital.com', password: 'admin123', role: 'admin' },
]

function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(defaultUsers))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) return JSON.parse(stored)
    } catch (e) { /* ignore */ }
    return null
  })
  const [users, setUsers] = useState(loadUsers)

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [user])

  const login = useCallback((email, password) => {
    const found = users.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...safeUser } = found
      setUser(safeUser)
      return { success: true, user: safeUser }
    }
    return { success: false, error: 'Credenciales inválidas' }
  }, [users])

  const register = useCallback((name, email, password, role = 'user') => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'El correo ya está registrado' }
    }
    const newUser = { id: users.length + 1, name, email, password, role }
    setUsers(prev => [...prev, newUser])
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    return { success: true, user: safeUser }
  }, [users])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
