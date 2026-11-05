function storageKey(ownerId) {
  return `wa1paper-saved-wallpaper-folders:${ownerId ?? "guest"}`;
}

export function readSavedWallpaperFolders(ownerId = null) {
  const saved = window.localStorage.getItem(storageKey(ownerId));
  if (!saved) return [];

  const folders = JSON.parse(saved);
  if (
    !Array.isArray(folders) ||
    folders.some((folder) =>
      !folder ||
      typeof folder.id !== "string" ||
      typeof folder.name !== "string" ||
      !Array.isArray(folder.items),
    )
  ) {
    throw new Error("Os dados das pastas salvas estão inválidos.");
  }

  return folders;
}

export function writeSavedWallpaperFolders(folders, ownerId = null) {
  window.localStorage.setItem(storageKey(ownerId), JSON.stringify(folders));
  window.dispatchEvent(new CustomEvent("wa1paper-saved-folders-updated", { detail: { ownerId } }));
}
