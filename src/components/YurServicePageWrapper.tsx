import React, { useEffect, useState } from 'react'
import { loadYurServiceMicrofrontend } from '@/lib/yurservice-loader'

export function YurServicePageWrapper() {
  const [MicrofrontendComponent, setMicrofrontendComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMicrofrontend() {
      try {
        setLoading(true)
        setError(null)
        
        const module = await loadYurServiceMicrofrontend({
          cdnUrl: import.meta.env.VITE_YURSERVICE_CDN_URL || 'http://localhost:3001'
        })
        
        if (module && module.YurServicePage) {
          setMicrofrontendComponent(() => module.YurServicePage)
        } else {
          throw new Error('YurServicePage component not found in microfrontend module')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load microfrontend')
        console.error('Error loading YurService microfrontend:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMicrofrontend()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">Загрузка микрофронтенда...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-12">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Ошибка загрузки микрофронтенда: {error}</p>
          <p className="text-sm mt-2">
            Убедитесь, что микрофронтенд запущен на {import.meta.env.VITE_YURSERVICE_CDN_URL || 'http://localhost:3001'}
          </p>
        </div>
      </div>
    )
  }

  if (!MicrofrontendComponent) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <p className="text-muted-foreground">Компонент не найден</p>
      </div>
    )
  }

  return <MicrofrontendComponent />
}

