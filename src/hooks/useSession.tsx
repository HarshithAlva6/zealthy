'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../lib/api'
import { UserData } from '../lib/validation'

type SessionResponse = {
  sessionId: string | null 
  userData: UserData
  currentStep: number
}

type SessionData = SessionResponse & {
  setSessionId: (value: string | null) => void
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
  setCurrentStep: (value: number) => void
}

const SessionContext = createContext<SessionData | undefined>(undefined)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData>({})
  const [currentStep, setCurrentStep] = useState<number>(1)

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const sessionData = await api.get<SessionResponse>('/auth/session')
        if (sessionData.sessionId) {
          setSessionId(sessionData.sessionId)
          setUserData(sessionData.userData || {})
          setCurrentStep(sessionData.currentStep ?? 1)
        }
      } catch (error) {
        console.warn('No existing session')
      }
    }
    checkExistingSession()
  }, [])

  return (
    <SessionContext.Provider
      value={{ sessionId, setSessionId, userData, setUserData, currentStep, setCurrentStep }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
