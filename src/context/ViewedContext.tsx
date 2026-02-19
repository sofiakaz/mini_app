import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { supabase, getUserId } from '../supabase'
import type { Movie } from "../components/MovieCard"

interface ViewedContextType {
  viewed: Movie[]
  addToViewed: (movie: Movie) => void
  removeFromViewed: (movie: Movie) => void
  isViewed: (title: string) => boolean
}

const ViewedContext = createContext<ViewedContextType | undefined>(undefined)

export function ViewedProvider({ children }: { children: ReactNode }) {
  const [viewed, setViewed] = useState<Movie[]>([])
  const userId = getUserId()

  // Загрузить просмотренные из Supabase при старте
  useEffect(() => {
    loadViewed()
  }, [])

  async function loadViewed() {
    const { data } = await supabase
      .from('viewed')
      .select('*')
      .eq('user_id', userId)
    
    if (data) {
      const movies: Movie[] = data.map(row => ({
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
      setViewed(movies)
    }
  }

  const addToViewed = useCallback(async (movie: Movie) => {
    // Добавляем в Supabase
    await supabase.from('viewed').upsert({
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
    
    // Добавляем в локальный стейт
    setViewed((prev) => {
      if (prev.some((m) => m.title === movie.title)) return prev
      return [...prev, movie]
    })
  }, [userId])

  const removeFromViewed = useCallback(async (movie: Movie) => {
    // Удаляем из Supabase
    await supabase
      .from('viewed')
      .delete()
      .eq('user_id', userId)
      .eq('title', movie.title)
    
    // Удаляем из локального стейта
    setViewed((prev) => prev.filter((m) => m.title !== movie.title))
  }, [userId])

  const isViewed = useCallback((title: string) => {
    return viewed.some((m) => m.title === title)
  }, [viewed])

  return (
    <ViewedContext.Provider value={{ viewed, addToViewed, removeFromViewed, isViewed }}>
      {children}
    </ViewedContext.Provider>
  )
}

export function useViewed() {
  const context = useContext(ViewedContext)
  if (!context) throw new Error("useViewed must be used within ViewedProvider")
  return context
}
