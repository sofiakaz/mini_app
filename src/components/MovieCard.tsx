import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState } from "react"
import {
  Heart,
  X,
  Star,
  Globe,
  Info,
  Clock,
  Film,
  Eye,  // Добавлено для кнопки просмотра
} from "lucide-react"

export interface Movie {
  title: string
  year: number
  country: string
  poster: string
  rating: number
  description: string
  director: string
  duration: number
  genre: string
}

interface Props {
  movie: Movie
  onLike?: () => void
  onDislike?: () => void
  onViewed?: () => void  // Добавлено
  onRemove?: () => void
  isFavorite?: boolean
  isViewed?: boolean  // Добавлено
}

export function MovieCard({
  movie,
  onLike,
  onDislike,
  onViewed,  // Добавлено
  onRemove,
  isFavorite = false,
  isViewed = false,  // Добавлено
}: Props) {
  const [showInfo, setShowInfo] = useState(false)
  const [currentMovie, setCurrentMovie] = useState(movie)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (movie.poster === currentMovie.poster) return

    setLoading(true)
    const img = new Image()
    img.src = movie.poster

    img.onload = () => {
      setCurrentMovie(movie)
      setLoading(false)
    }
  }, [movie, currentMovie.poster])

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[320px] aspect-[4.8/7] rounded-[28px] overflow-hidden shadow-2xl bg-white">
        {/* ===== POSTER CARD ===== */}
        {!showInfo && (
          <>
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

            <button
              onClick={() => setShowInfo(true)}
              className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur rounded-full p-2"
            >
              <Info className="w-4 h-4 text-white" />
            </button>

            {/* Индикатор просмотра */}
            {isViewed && (
              <div className="absolute top-3 left-3 z-20 bg-green-500 rounded-full p-1">
                <Eye className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="absolute bottom-20 left-4 right-4 text-white z-10">
              <h2 className="text-2xl font-semibold mb-1">
                {currentMovie.title}
              </h2>

              <div className="flex gap-3 text-m opacity-90">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {currentMovie.rating.toFixed(1)}
                </span>

                <span>{currentMovie.year}</span>

                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {currentMovie.country}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {!isFavorite && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 z-10">  {/* Уменьшен gap для трех кнопок */}
                <button
                  onClick={() => onDislike?.()}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>

                <button
                  onClick={() => onViewed?.()}  // Добавлено
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Eye className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={() => onLike?.()}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-xl"
                >
                  <Heart className="w-6 h-6 text-white fill-white" />
                </button>
              </div>
            )}

            {/* FAVORITE REMOVE BUTTON */}
            {isFavorite && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                <button
                  onClick={() => onRemove?.()}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>
              </div>
            )}
          </>
        )}

        {/* LOADING */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-white"
            />
          )}
        </AnimatePresence>

        {/* ===== INFO CARD ===== */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white rounded-[28px] flex flex-col"
            >
              <div className="relative h-14">
                <button
                  onClick={() => setShowInfo(false)}
                  className="absolute top-4 right-4 text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-6">
                <h2 className="text-xl font-semibold mb-3">
                  {currentMovie.title}
                </h2>

                <div className="flex gap-4 text-m text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {currentMovie.rating.toFixed(1)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {currentMovie.country}
                  </span>
                </div>

                <p className="mb-4">{currentMovie.description}</p>

                <div className="space-y-2 text-m text-gray-600 leading-snug">
                  <div>
                    <Film className="inline w-[1em] h-[1em] mr-2 relative top-[-1px]" />
                    Режиссёр: {currentMovie.director}
                  </div>

                  <div>
                    <Clock className="inline w-[1em] h-[1em] mr-2 relative top-[-1px]" />
                    Длительность: {currentMovie.duration} мин
                  </div>

                  <div>
                    <Star className="inline w-[1em] h-[1em] mr-2 relative top-[-1px]" />
                    Жанры: {currentMovie.genre}
                  </div>
                </div>
              </div>

              <div className="h-12 bg-white border-t border-gray-100" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
