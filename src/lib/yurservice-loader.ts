import { supabase } from './supabase'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

export interface YurServiceMicrofrontendConfig {
  cdnUrl?: string
}

let microfrontendModule: any = null
let loadingPromise: Promise<any> | null = null

function ensureReactInWindow() {
  if ((window as any).React && (window as any).ReactDOM) {
    return
  }

  (window as any).React = React
  (window as any).ReactDOM = ReactDOM
  
  if (React.jsx && !(window as any).ReactJSXRuntime) {
    (window as any).ReactJSXRuntime = {
      jsx: React.jsx,
      jsxs: React.jsxs || React.jsx,
      Fragment: React.Fragment,
    }
  }
}

export async function loadYurServiceMicrofrontend(
  config: YurServiceMicrofrontendConfig = {}
): Promise<any> {
  if (microfrontendModule) {
    return microfrontendModule
  }

  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    try {
      const envCdnUrl = import.meta.env.VITE_YURSERVICE_CDN_URL
      let defaultCdnUrl: string
      if (envCdnUrl) {
        defaultCdnUrl = envCdnUrl
      } else if (import.meta.env.DEV) {
        defaultCdnUrl = 'http://localhost:3001'
      } else {
        defaultCdnUrl = 'https://cdn.jsdelivr.net/gh/global50/remote-yurservice-cdn@main/dist'
      }
      const cdnUrl = config.cdnUrl || defaultCdnUrl
      
      const isLocalDev = cdnUrl.includes('localhost') || cdnUrl.startsWith('http://127.0.0.1')
      const useProductionFile = !isLocalDev
      
      ;(window as any).__SUPABASE_CLIENT__ = supabase
      ensureReactInWindow()

      if (useProductionFile) {
        // CRITICAL: Ensure React is synchronously available BEFORE script loads
        // UMD module executes immediately when script tag is added to DOM
        ensureReactInWindow()
        
        // Double-check React is available
        if (!(window as any).React || !(window as any).ReactDOM) {
          return Promise.reject(new Error('React or ReactDOM not available in window. Cannot load microfrontend.'))
        }
        
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = `${cdnUrl}/yurservice-microfrontend.umd.js`
          
          script.onload = () => {
            // UMD module should have executed and created window.YurServiceMicrofrontend
            const module = (window as any).YurServiceMicrofrontend
            if (module && module.YurServicePage) {
              microfrontendModule = module
              resolve(module)
            } else {
              console.error('Available in window:', Object.keys(window).filter(k => k.includes('React') || k.includes('Yur')))
              reject(new Error('YurServiceMicrofrontend not found or incomplete. React may not be available when module executed.'))
            }
          }
          
          script.onerror = (error) => {
            console.error('Script load error:', error)
            reject(new Error(`Failed to load microfrontend script from: ${cdnUrl}/yurservice-microfrontend.umd.js`))
          }
          
          document.head.appendChild(script)
        })
      } else {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = `${cdnUrl}/src/index.ts`
        document.head.appendChild(script)

        return new Promise((resolve, reject) => {
          script.onload = async () => {
            try {
              const mod = await import(/* @vite-ignore */ `${cdnUrl}/src/index.ts`)
              microfrontendModule = mod
              resolve(mod)
            } catch (error) {
              reject(error)
            }
          }
          script.onerror = () => {
            reject(new Error(`Failed to load microfrontend from: ${cdnUrl}/src/index.ts`))
          }
        })
      }
    } catch (error) {
      loadingPromise = null
      throw error
    }
  })()

  return loadingPromise
}

