import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"  // Добавлено: type-only import для ReactNode
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

  useEffect(() => {
    const stored = localStorage.getItem("viewed")
    if (stored) {
      setViewed(JSON.parse(stored))
    }
  }, [])

  const addToViewed = (movie: Movie) => {
    setViewed((prev) => {
      if (!prev.some((m) => m.title === movie.title)) {
        const newViewed = [...prev, movie]
        localStorage.setItem("viewed", JSON.stringify(newViewed))
        return newViewed
      }
      return prev
    })
  }

  const removeFromViewed = (movie: Movie) => {
    setViewed((prev) => {
      const newViewed = prev.filter((m) => m.title !== movie.title)
      localStorage.setItem("viewed", JSON.stringify(newViewed))
      return newViewed
    })
  }

  const isViewed = (title: string) => viewed.some((m) => m.title === title)

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