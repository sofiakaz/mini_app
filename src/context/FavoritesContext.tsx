import { createContext, useContext, useState } from "react"
import type { Movie } from "../components/MovieCard"

interface FavoritesContextType {
  favorites: Movie[]
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (title: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])

  const addToFavorites = (movie: Movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.title === movie.title) ? prev : [...prev, movie]
    )
  }

  const removeFromFavorites = (title: string) => {
    setFavorites((prev) => prev.filter((movie) => movie.title !== title))
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error("useFavorites must be used inside FavoritesProvider")
  }
  return ctx
}
