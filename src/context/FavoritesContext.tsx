import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getUserId } from '../supabase'
import type { Movie } from "../components/MovieCard"

interface FavoritesContextType {
  favorites: Movie[]
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (title: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const userId = getUserId()

  useEffect(() => {
    loadFavorites()
  }, [])

  async function loadFavorites() {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
    
    if (data) {
      const movies: Movie[] = data.map((row: any) => ({
        title: row.title,
        year: row.year,
        poster: row.poster,
        rating: row.rating,
        country: row.country,
        director: row.director,
        duration: row.duration,
        genre: row.genre,
        description: row.description,
      }))
      setFavorites(movies)
    }
  }

  const addToFavorites = async (movie: Movie) => {
    await supabase.from('favorites').upsert({
      user_id: userId,
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
      rating: movie.rating,
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      genre: movie.genre,
      description: movie.description,
    }, { onConflict: 'user_id,title' })
    
    setFavorites((prev) =>
      prev.some((m) => m.title === movie.title) ? prev : [...prev, movie]
    )
  }

  const removeFromFavorites = async (title: string) => {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('title', title)
    
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
