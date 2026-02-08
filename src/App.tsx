import { useEffect, useMemo, useState } from "react"
import { movies } from "./data/movies"
import { MovieCard } from "./components/MovieCard"
import type { Movie } from "./components/MovieCard"
import { PhonePreview } from "./components/PhonePreview"
import { BottomBar } from "./components/BottomBar"
import { Filter, X } from "lucide-react"
import { useFavorites } from "./context/FavoritesContext"
import { CollectionsPage } from "./components/CollectionsPage"

/* ===== ТИПЫ ===== */

type Era = "pre2000" | "2000s" | "2010s" | "2020s"
type View = "feed" | "favorites" | "collections"

type Genre =
  | "драма"
  | "фантастика"
  | "ужасы"
  | "комедия"
  | "триллер"
  | "детектив"
  | "семейный"

type TgUser = {
  id: number
  first_name?: string
  username?: string
}

/* ===== КОНСТАНТЫ ===== */

const ERAS = [
  { key: "pre2000", label: "До 2000", from: 0, to: 1999 },
  { key: "2000s", label: "2000–2010", from: 2000, to: 2010 },
  { key: "2010s", label: "2010–2020", from: 2010, to: 2020 },
  { key: "2020s", label: "2020–2026", from: 2020, to: 2026 },
] as const

const GENRES: { label: string; value: Genre }[] = [
  { label: "Драма", value: "драма" },
  { label: "Фантастика", value: "фантастика" },
  { label: "Ужасы", value: "ужасы" },
  { label: "Комедия", value: "комедия" },
  { label: "Триллер", value: "триллер" },
  { label: "Детектив", value: "детектив" },
  { label: "Семейный", value: "семейный" },
]

/* ===== ВСПОМОГАТЕЛЬНОЕ ===== */

function normalizeGenre(genre: string): Genre {
  return genre.trim().toLowerCase() as Genre
}

function formatGenres(genres: string[]) {
  if (genres.length === 1) return genres[0]
  if (genres.length === 2) return `${genres[0]} и ${genres[1]}`
  return `${genres.slice(0, -1).join(", ")} и ${genres.at(-1)}`
}

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5)
}

/* ===== APP ===== */

function App() {
  const [index, setIndex] = useState(0)
  const [view, setView] = useState<View>("feed")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [selectedEras, setSelectedEras] = useState<Era[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites()

  /* ===== TELEGRAM ===== */
  const [tgUser, setTgUser] = useState<TgUser | null>(null)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    if (tg.initDataUnsafe?.user) {
      setTgUser(tg.initDataUnsafe.user)
    }
  }, [])

  /* ===== ФИЛЬТРАЦИЯ ===== */

  const filteredMovies = useMemo(() => {
    const result = movies.filter((movie) => {
      const matchesEra =
        selectedEras.length === 0 ||
        selectedEras.some((eraKey) => {
          const era = ERAS.find((e) => e.key === eraKey)!
          return movie.year >= era.from && movie.year <= era.to
        })

      const movieGenres = movie.genres.map(normalizeGenre)
      const matchesGenre =
        selectedGenre === null || movieGenres.includes(selectedGenre)

      return matchesEra && matchesGenre
    })

    return shuffle(result)
  }, [selectedEras, selectedGenre])

  useEffect(() => {
    setIndex(0)
  }, [selectedEras, selectedGenre])

  const movie = filteredMovies[index % Math.max(filteredMovies.length, 1)]

  const mappedMovie: Movie | null = movie
    ? {
        title: movie.title,
        year: movie.year,
        country: movie.country ?? "—",
        poster: movie.poster,
        rating: movie.vote_average,
        description: movie.description,
        director: movie.director,
        duration: movie.duration,
        genre: formatGenres(movie.genres),
      }
    : null

  /* ===== UI ===== */

  const content = (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-rose-200 via-pink-100 to-neutral-200">

      {tgUser && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-xs bg-white/80 px-3 py-1 rounded-full">
          @{tgUser.username ?? tgUser.first_name}
        </div>
      )}

      <main className="flex-1 overflow-hidden pb-24">
        {view === "feed" && (
          <div className="relative h-full pt-40 flex justify-center">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="absolute top-24 right-6 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg flex items-center justify-center"
            >
              <Filter className="w-5 h-5 text-white" />
            </button>

            {mappedMovie && (
              <MovieCard
                movie={mappedMovie}
                onLike={() => {
                  addToFavorites(mappedMovie)
                  setIndex((i) => i + 1)
                }}
                onDislike={() => setIndex((i) => i + 1)}
              />
            )}
          </div>
        )}

        {view === "favorites" && (
          <div className="h-full px-4 pt-6 space-y-4 overflow-y-auto">
            {favorites.length === 0 && (
              <div className="text-center text-gray-400 mt-32">
                Избранное пусто 💔
              </div>
            )}

            {favorites.map((movie) => (
              <MovieCard
                key={movie.title}
                movie={movie}
                isFavorite
                onRemove={() => removeFromFavorites(movie.title)}
              />
            ))}
          </div>
        )}

        {view === "collections" && (
          <div className="h-full overflow-y-auto">
            <CollectionsPage />
          </div>
        )}
      </main>

      {/* ===== FILTER ===== */}
      {isFilterOpen && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-white rounded-t-3xl p-6 overflow-y-auto">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Фильтры</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* ЭРЫ */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Годы</h4>
              <div className="flex flex-wrap gap-2">
                {ERAS.map((era) => {
                  const active = selectedEras.includes(era.key)
                  return (
                    <button
                      key={era.key}
                      onClick={() =>
                        setSelectedEras((prev) =>
                          active
                            ? prev.filter((e) => e !== era.key)
                            : [...prev, era.key]
                        )
                      }
                      className={`px-4 py-2 rounded-full text-sm border ${
                        active
                          ? "bg-pink-500 text-white border-pink-500"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {era.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ЖАНРЫ */}
            <div>
              <h4 className="font-semibold mb-3">Жанр</h4>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => {
                  const active = selectedGenre === genre.value
                  return (
                    <button
                      key={genre.value}
                      onClick={() =>
                        setSelectedGenre(active ? null : genre.value)
                      }
                      className={`px-4 py-2 rounded-full text-sm border ${
                        active
                          ? "bg-pink-500 text-white border-pink-500"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {genre.label}
                    </button>
                  )
                })}
              </div>
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

export default App
