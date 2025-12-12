export const getStorageUrl = (filePath: string) => {
  if (filePath.startsWith("http")) {
    return filePath;
  }

  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  if (!storageUrl) return "";

  return `${storageUrl}${filePath}`;
};
