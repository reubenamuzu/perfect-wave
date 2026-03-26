'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface Settings {
  momoNumber: string
  whatsappNumber: string
}

const DEFAULTS: Settings = {
  momoNumber: '0558373809',
  whatsappNumber: '233597473708',
}

const SettingsContext = createContext<Settings>(DEFAULTS)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.momoNumber && data.whatsappNumber) {
          setSettings({ momoNumber: data.momoNumber, whatsappNumber: data.whatsappNumber })
        }
      })
      .catch(() => {/* keep defaults */})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): Settings {
  return useContext(SettingsContext)
}
