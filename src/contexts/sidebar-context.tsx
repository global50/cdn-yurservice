// Context for managing collapsible sidebar states with localStorage persistence

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  leftCollapsed: boolean
  rightCollapsed: boolean
  toggleLeft: () => void
  toggleRight: () => void
  collapseAll: () => void
  expandAll: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

const STORAGE_KEYS = {
  LEFT: 'sidebar-left-collapsed',
  RIGHT: 'sidebar-right-collapsed',
}

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [leftCollapsed, setLeftCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LEFT)
    return stored ? JSON.parse(stored) : false
  })

  const [rightCollapsed, setRightCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RIGHT)
    return stored ? JSON.parse(stored) : false
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEFT, JSON.stringify(leftCollapsed))
  }, [leftCollapsed])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RIGHT, JSON.stringify(rightCollapsed))
  }, [rightCollapsed])

  const toggleLeft = () => setLeftCollapsed((prev) => !prev)
  const toggleRight = () => setRightCollapsed((prev) => !prev)

  const collapseAll = () => {
    setLeftCollapsed(true)
    setRightCollapsed(true)
  }

  const expandAll = () => {
    setLeftCollapsed(false)
    setRightCollapsed(false)
  }

  return (
    <SidebarContext.Provider
      value={{
        leftCollapsed,
        rightCollapsed,
        toggleLeft,
        toggleRight,
        collapseAll,
        expandAll,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
