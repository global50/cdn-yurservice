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
      'react': '/node_modules/react/index.js',
      'react-dom': '/node_modules/react-dom/index.js',
      'react/jsx-runtime': '/node_modules/react/jsx-runtime.js',
      '@supabase/supabase-js': '/node_modules/@supabase/supabase-js/dist/esm/index.js'
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
      }, 100)
    }, { once: true })
    setTimeout(() => {
      importMapsEnsured = true
      resolve(undefined)
    }, 300)
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
        await ensureImportMaps()
        
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

