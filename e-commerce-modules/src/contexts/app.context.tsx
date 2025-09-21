/* eslint-disable react-refresh/only-export-components */
import type { User } from '@/types/user.type'
import { getAccessTokenFromLS } from '@/utils/auths'
import React, { createContext, useState } from 'react'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
}

const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: null,
  setProfile: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState(defaultValue.profile)
  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
