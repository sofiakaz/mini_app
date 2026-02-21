import { useEffect, useMemo, useState, useRef } from "react"
import { movies } from "./data/movies"
import { MovieCard } from "./components/MovieCard"
import type { Movie } from "./components/MovieCard"
import { PhonePreview } from "./components/PhonePreview"
import { BottomBar } from "./components/BottomBar"
import { Filter, X } from "lucide-react"
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext"
import { ViewedProvider, useViewed } from "./context/ViewedContext"
import { CollectionsPage } from "./components/CollectionsPage"

type Era = "pre2000" | "2000s" | "2010s" | "2020s"
type View = "feed" | "favorites" | "collections"
type Genre = "драма" | "фантастика" | "ужасы" | "комедия" | "триллер" | "детектив" | "семейный"
type TgUser = { id: number; first_name?: string; username?: string }

const ERAS = [
  { key: "pre2000", label: "До 2000", from: 0, to: 1999 },
  { key: "2000s", label: "2000–2010", from: 2000, to: 2010 },
  { key: "2010s", label: "2010–2020", from: 2010, to: 2020 },
  { key: "2020s", label: "2020–2026", from: 2020, to: 2026 },
] as const

const GENRES = [
  { label: "Драма", value: "драма" as Genre },
  { label: "Фантастика", value: "фантастика" as Genre },
  { label: "Ужасы", value: "ужасы" as Genre },
  { label: "Комедия", value: "комедия" as Genre },
  { label: "Триллер", value: "триллер" as Genre },
  { label: "Детектив", value: "детектив" as Genre },
  { label: "Семейный", value: "семейный" as Genre },
]

function normalizeGenre(genre: string): Genre {
  return genre.trim().toLowerCase() as Genre
}

function formatGenres(genres: string[]) {
  if (genres.length === 0) return ""
  if (genres.length === 1) return genres[0]
  if (genres.length === 2) return `${genres[0]} и ${genres[1]}`
  return `${genres.slice(0, -1).join(", ")} и ${genres.at(-1)}`
}

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5)
}

function AppContent() {
  const [index, setIndex] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [view, setView] = useState<View>("feed")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedEras, setSelectedEras] = useState<Era[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [tgUser, setTgUser] = useState<TgUser | null>(null)
  const [hideViewed, setHideViewed] = useState(false)
  
  // Реф для блокировки множественных нажатий
  const isProcessing = useRef(false)

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites()
  const { addToViewed, isViewed } = useViewed()

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user)
      }
    }
  }, [])

  const filteredMovies = useMemo(() => {
    const result = movies.filter((movie) => {
      const matchesEra = selectedEras.length === 0 || selectedEras.some((eraKey) => {
        const era = ERAS.find((e) => e.key === eraKey)!
        return movie.year >= era.from && movie.year <= era.to
      })

      const movieGenres = movie.genres.map(normalizeGenre)
      const matchesGenre = selectedGenre === null || movieGenres.includes(selectedGenre)
      const matchesViewed = !hideViewed || !isViewed(movie.title)

      return matchesEra && matchesGenre && matchesViewed
    })

    return shuffle(result)
  }, [selectedEras, selectedGenre, hideViewed, isViewed])

  useEffect(() => {
    setIndex(0)
  }, [selectedEras, selectedGenre, hideViewed])

  const currentMovieData = filteredMovies[index % Math.max(filteredMovies.length, 1)]

  const mappedMovie: Movie | null = useMemo(() => {
    if (!currentMovieData) return null
    return {
      title: currentMovieData.title,
      year: currentMovieData.year,
      country: currentMovieData.country ?? "—",
      poster: currentMovieData.poster,
      rating: currentMovieData.vote_average ?? 0,
      description: currentMovieData.description,
      director: currentMovieData.director,
      duration: currentMovieData.duration,
      genre: formatGenres(currentMovieData.genres),
    }
  }, [currentMovieData])

  // Обработчики с защитой от множественных нажатий
  // Обработчики с защитой от множественных нажатий
const handleLike = () => {
  if (isProcessing.current || !mappedMovie) return
  isProcessing.current = true
  
  addToFavorites(mappedMovie)
  setIndex(i => i + 1)
  
  setTimeout(() => {
    isProcessing.current = false
  }, 500)
}

const handleDislike = () => {
  if (isProcessing.current) return
  isProcessing.current = true
  
  setIndex(i => i + 1)
  
  setTimeout(() => {
    isProcessing.current = false
  }, 500)
}

const handleViewed = () => {
  if (!mappedMovie) return
  addToViewed(mappedMovie)
}

  const content = (
    <div className="relative w-full h-screen bg-gradient-to-b from-rose-200 via-pink-100 to-neutral-200 overflow-hidden text-slate-900">
      {tgUser && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-[10px] font-medium bg-white/60 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/40">
          @{tgUser.username || tgUser.first_name}
        </div>
      )}

      <div className="h-full pb-20">
        {view === "feed" && (
          <div className="relative h-full pt-40 flex justify-center px-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="absolute top-24 right-6 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>

            {mappedMovie ? (
              <MovieCard
                movie={mappedMovie}
                onLike={handleLike}
                onDislike={handleDislike}
                onViewed={handleViewed}
                isViewed={isViewed(mappedMovie.title)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-xl font-medium">Фильмы не найдены</p>
                <p className="text-sm mt-2">Попробуйте изменить настройки фильтра</p>
                <button 
                  onClick={() => {
                    setHideViewed(false)
                    setSelectedEras([])
                    setSelectedGenre(null)
                  }}
                  className="mt-4 px-4 py-2 bg-white rounded-full shadow text-pink-500 font-medium"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        )}

        {view === "favorites" && (
          <div className="h-full px-4 pt-6 pb-8 space-y-4 overflow-y-auto no-scrollbar">
            <h2 className="text-2xl font-bold px-2 mb-4">Избранное</h2>
            {favorites.length === 0 ? (
              <div className="text-center text-gray-400 mt-32">Здесь пока пусто 💔</div>
            ) : (
              favorites.map((m) => (
                <MovieCard
                  key={m.title}
                  movie={m}
                  isFavorite
                  onRemove={() => removeFromFavorites(m.title)}
                  isViewed={isViewed(m.title)}
                />
              ))
            )}
          </div>
        )}

        {view === "collections" && (
          <div className="h-full overflow-y-auto no-scrollbar">
            <CollectionsPage
              onSelectCollection={setSelectedCollection}
              selectedCollection={selectedCollection}
              onBack={() => setSelectedCollection(null)}
              onLike={addToFavorites}
              onViewed={addToViewed}
              isViewed={(title) => isViewed(title)}
            />
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="absolute inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-white rounded-t-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-y-auto">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Фильтры</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="font-bold mb-4 text-gray-400 uppercase text-xs tracking-widest">Эпоха</h4>
                <div className="flex flex-wrap gap-2">
                  {ERAS.map((era) => {
                    const active = selectedEras.includes(era.key)
                    return (
                      <button
                        key={era.key}
                        onClick={() => setSelectedEras(prev => active ? prev.filter(e => e !== era.key) : [...prev, era.key])}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                          active ? "bg-pink-500 text-white shadow-md shadow-pink-200" : "bg-gray-50 text-gray-600 border border-gray-100"
                        }`}
                      >
                        {era.label}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <h4 className="font-bold mb-4 text-gray-400 uppercase text-xs tracking-widest">Жанр</h4>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => {
                    const active = selectedGenre === g.value
                    return (
                      <button
                        key={g.value}
                        onClick={() => setSelectedGenre(active ? null : g.value)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                          active ? "bg-pink-500 text-white shadow-md shadow-pink-200" : "bg-gray-50 text-gray-600 border border-gray-100"
                        }`}
                      >
                        {g.label}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest">
                    Скрыть просмотренные
                  </h4>
                  <button
                    onClick={() => setHideViewed(!hideViewed)}
                    className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${
                      hideViewed ? "bg-pink-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        hideViewed ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <BottomBar view={view} setView={setView} />
    </div>
  )

  const isDev = import.meta.env.DEV
  return isDev ? <PhonePreview>{content}</PhonePreview> : content
}

function App() {
  return (
    <FavoritesProvider>
      <ViewedProvider>
        <AppContent />
      </ViewedProvider>
    </FavoritesProvider>
  )
}

export default App
