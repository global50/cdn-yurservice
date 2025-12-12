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
        await ensureImportMaps()
        
        return new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.type = 'module'
          script.src = `${cdnUrl}/yurservice-microfrontend.js`
          
          script.onload = async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 100))
              const mod = await import(/* @vite-ignore */ `${cdnUrl}/yurservice-microfrontend.js`)
              microfrontendModule = mod
              resolve(mod)
            } catch (error) {
              console.error('ES module import failed, trying UMD fallback:', error)
              try {
                const umdScript = document.createElement('script')
                umdScript.src = `${cdnUrl}/yurservice-microfrontend.umd.js`
                umdScript.onload = () => {
                  const umdModule = (window as any).YurServiceMicrofrontend
                  if (umdModule) {
                    microfrontendModule = umdModule
                    resolve(umdModule)
                  } else {
                    reject(new Error('UMD module not found in window.YurServiceMicrofrontend'))
                  }
                }
                umdScript.onerror = () => {
                  reject(new Error(`Failed to load microfrontend from: ${cdnUrl}/yurservice-microfrontend.umd.js`))
                }
                document.head.appendChild(umdScript)
              } catch (umdError) {
                reject(new Error(`Failed to import microfrontend: ${error}`))
              }
            }
          }
          
          script.onerror = () => {
            reject(new Error(`Failed to load microfrontend script from: ${cdnUrl}/yurservice-microfrontend.js`))
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

