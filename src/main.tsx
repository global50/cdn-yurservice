/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./tiptap.css";
import { init, miniApp, retrieveRawLaunchParams } from "@tma.js/sdk";

let isTelegramMiniApp = false;
let telegramInitialized = false;

const initializeTelegramSDK = () => {
  try {
    init();
    telegramInitialized = true;

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
      isTelegramMiniApp = true;
      console.log("Mini App готово");
    }
  } catch (_e) {
    console.log("TMA data not found");
    telegramInitialized = true;
  }
};

// Utility to check if running in Telegram mini app
export const checkIsTelegramMiniApp = (): boolean => {
  return isTelegramMiniApp;
};

// Utility to check if Telegram SDK is initialized
export const isTelegramReady = (): boolean => {
  return telegramInitialized;
};

// Get Telegram launch params if available
export const getTelegramLaunchParams = () => {
  try {
    const initDataRaw = retrieveRawLaunchParams();
    const urlParams = new URLSearchParams(initDataRaw);
    const initData = urlParams.get("tgWebAppData");
    return initData;
  } catch {
    return null;
  }
};

initializeTelegramSDK();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
