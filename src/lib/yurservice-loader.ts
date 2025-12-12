import { supabase } from './supabase'

export interface YurServiceMicrofrontendConfig {
  cdnUrl?: string
}

let microfrontendModule: any = null
let loadingPromise: Promise<any> | null = null

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
      
      ;(window as any).__SUPABASE_CLIENT__ = supabase

      const script = document.createElement('script')
      script.type = 'module'
      
      if (import.meta.env.PROD) {
        script.src = `${cdnUrl}/yurservice-microfrontend.js`
      } else {
        script.src = `${cdnUrl}/src/index.ts`
      }

      document.head.appendChild(script)

      return new Promise((resolve, reject) => {
        script.onload = async () => {
          try {
            const modulePath = import.meta.env.PROD 
              ? `${cdnUrl}/yurservice-microfrontend.js`
              : `${cdnUrl}/src/index.ts`
            const mod = await import(/* @vite-ignore */ modulePath)
            microfrontendModule = mod
            resolve(mod)
          } catch (error) {
            setTimeout(() => {
              const module = (window as any).YurServiceMicrofrontend
              if (module) {
                microfrontendModule = module
                resolve(module)
              } else {
                reject(error)
              }
            }, 100)
          }
        }
        script.onerror = () => {
          const modulePath = import.meta.env.PROD 
            ? `${cdnUrl}/yurservice-microfrontend.js`
            : `${cdnUrl}/src/index.ts`
          import(/* @vite-ignore */ modulePath)
            .then((mod) => {
              microfrontendModule = mod
              resolve(mod)
            })
            .catch(() => {
              reject(new Error(`Failed to load microfrontend from CDN: ${modulePath}`))
            })
        }
      })
    } catch (error) {
      loadingPromise = null
      throw error
    }
  })()

  return loadingPromise
}

