import { supabase } from './supabase'

export interface YurServiceMicrofrontendConfig {
  cdnUrl?: string
}

let microfrontendModule: any = null
let loadingPromise: Promise<any> | null = null
let importMapsEnsured = false

async function ensureImportMaps() {
  if (importMapsEnsured) return
  
  const existingImportMap = document.querySelector('script[type="importmap"]')
  if (existingImportMap) {
    importMapsEnsured = true
    return
  }

  const importMap = {
    imports: {
      'react': 'https://esm.sh/react@18.3.1',
      'react-dom': 'https://esm.sh/react-dom@18.3.1',
      'react/jsx-runtime': 'https://esm.sh/react@18.3.1/jsx-runtime',
      '@supabase/supabase-js': 'https://esm.sh/@supabase/supabase-js@2.57.0'
    }
  }

  const script = document.createElement('script')
  script.type = 'importmap'
  script.textContent = JSON.stringify(importMap)
  document.head.insertBefore(script, document.head.firstChild)
  
  await new Promise(resolve => {
    script.addEventListener('load', () => {
      setTimeout(() => {
        importMapsEnsured = true
        resolve(undefined)
      }, 50)
    }, { once: true })
    setTimeout(() => {
      importMapsEnsured = true
      resolve(undefined)
    }, 200)
  })
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

      if (useProductionFile) {
        return new Promise((resolve, reject) => {
          const moduleUrl = `${cdnUrl}/yurservice-microfrontend.js`
          
          const script = document.createElement('script')
          script.type = 'module'
          script.src = moduleUrl
          
          script.onload = async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 300))
              const mod = await import(/* @vite-ignore */ moduleUrl)
              microfrontendModule = mod
              resolve(mod)
            } catch (importError) {
              console.error('Import after script load failed:', importError)
              reject(new Error(`Failed to import microfrontend: ${importError}`))
            }
          }
          
          script.onerror = (error) => {
            console.error('Script load error:', error)
            reject(new Error(`Failed to load microfrontend script from: ${moduleUrl}. Check browser console for CORS errors.`))
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

