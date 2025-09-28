/* eslint-disable react-refresh/only-export-components */
import type { ExtendedPurchasesType } from '@/types/purchase.type'
import type { User } from '@/types/user.type'
import { getAccessTokenFromLS, getprofileFromLS } from '@/utils/auths'
import React, { createContext, useState } from 'react'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  reset: () => void
  extendedPurchases: ExtendedPurchasesType[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchasesType[]>>
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getprofileFromLS(),
  setProfile: () => null,
  reset: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null
})

const initialAppContext = getInitialAppContext()

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
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchasesType[]>(defaultValue.extendedPurchases)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setExtendedPurchases([])
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        extendedPurchases,
        setExtendedPurchases
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
