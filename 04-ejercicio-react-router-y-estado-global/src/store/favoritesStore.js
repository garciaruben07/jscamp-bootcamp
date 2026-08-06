import { create } from 'zustand'

export const useFavoritesStore = create((set, get) => ({
  favorites: [],

  addFavorite: (jobId) =>
    set((state) =>
      state.favorites.includes(jobId) ? state : { favorites: [...state.favorites, jobId] }
    ),

  removeFavorite: (jobId) =>
    set((state) => ({ favorites: state.favorites.filter((id) => id !== jobId) })),

  toggleFavorite: (jobId) =>
    set((state) =>
      state.favorites.includes(jobId)
        ? { favorites: state.favorites.filter((id) => id !== jobId) }
        : { favorites: [...state.favorites, jobId] }
    ),

  isFavorite: (jobId) => get().favorites.includes(jobId),
}))
