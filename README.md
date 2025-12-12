# YurService CDN

Приложение с микрофронтендом YurService, загружаемым через CDN.

## 🚀 Быстрый старт

### StackBlitz

1. Откройте проект в StackBlitz:
   ```
   https://stackblitz.com/github/your-username/cdn-yurservice
   ```

2. Настройте переменные окружения в `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_YURSERVICE_CDN_URL=https://raw.githubusercontent.com/global50/remote-yurservice-cdn/main/dist
   ```
   
   **Примечание:** Используйте `raw.githubusercontent.com` для немедленного доступа к последней версии. 
   Для production можно использовать `https://cdn.jsdelivr.net/gh/global50/remote-yurservice-cdn@main/dist` 
   (но может потребоваться время для обновления кэша CDN).

3. Микрофронтенд автоматически загрузится с CDN при переходе на `/yurservice`

### Локальная разработка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте файл `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_YURSERVICE_CDN_URL=https://cdn.jsdelivr.net/gh/global50/remote-yurservice-cdn@main/dist
   ```

3. Запустите приложение:
   ```bash
   npm run dev
   ```

## 📁 Структура

```
cdn-yurservice/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   └── YurServicePageWrapper.tsx
│   └── lib/
│       └── yurservice-loader.ts
└── package.json
```

## 🔧 Как это работает

1. При переходе на `/yurservice` загружается микрофронтенд с CDN
2. Supabase клиент передается через `window.__SUPABASE_CLIENT__`
3. Компонент `YurServicePage` рендерится в приложении

## 📦 CDN

Микрофронтенд размещен на CDN через jsDelivr:
- URL: `https://cdn.jsdelivr.net/gh/global50/remote-yurservice-cdn@main/dist`
- Файл: `yurservice-microfrontend.js`
