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
  Eye,
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
  onViewed?: () => void
  onUnviewed?: () => void // Новое: для удаления из просмотренных
  onRemove?: () => void
  isFavorite?: boolean
  isViewed?: boolean
}

export function MovieCard({
  movie,
  onLike,
  onDislike,
  onViewed,
  onUnviewed,
  onRemove,
  isFavorite = false,
  isViewed = false,
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

  // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

  const handleIndicatorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isViewed && window.confirm("Удалить этот фильм из списка просмотренных?")) {
      onUnviewed?.()
    }
  }

  const handleViewedAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Если уже просмотрено — удаляем, если нет — добавляем
    isViewed ? onUnviewed?.() : onViewed?.()
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onLike?.()
  }

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDislike?.()
  }

  const handleRemoveFromFavorites = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.()
  }

  const handleInfoToggle = (e: React.MouseEvent, state: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setShowInfo(state)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-[320px] aspect-[4.8/7] rounded-[28px] overflow-hidden shadow-2xl bg-white">
        
        {/* ===== ОСНОВНОЙ ВИД (ПОСТЕР) ===== */}
        {!showInfo && (
          <>
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

            {/* Кнопка ИНФО */}
            <button
              onClick={(e) => handleInfoToggle(e, true)}
              className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur rounded-full p-2 active:scale-90 transition-transform"
            >
              <Info className="w-4 h-4 text-white" />
            </button>

            {/* ИНДИКАТОР ПРОСМОТРА (Зеленый глазик в углу) */}
            {isViewed && (
              <button
                onClick={handleIndicatorClick}
                className="absolute top-3 left-3 z-20 bg-green-500 rounded-full p-1 shadow-lg active:scale-90 transition-transform hover:bg-red-500"
                title="Удалить из просмотренных"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
            )}

            {/* ТЕКСТОВАЯ ИНФОРМАЦИЯ */}
            <div className="absolute bottom-20 left-4 right-4 text-white z-10">
              <h2 className="text-2xl font-semibold mb-1 break-words max-h-24 overflow-y-auto no-scrollbar">
                {currentMovie.title}
              </h2>

              <div className="flex gap-3 text-sm opacity-90">
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

            {/* КНОПКИ ДЕЙСТВИЯ: ЛЕНТА */}
            {!isFavorite && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 z-10">
                <button
                  onClick={handleDislike}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>

                <button
                  onClick={handleViewedAction}
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <Eye className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={handleLike}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-xl active:scale-95 transition-all"
                >
                  <Heart className="w-6 h-6 text-white fill-white" />
                </button>
              </div>
            )}

            {/* КНОПКИ ДЕЙСТВИЯ: ИЗБРАННОЕ */}
            {isFavorite && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 z-10">
                {/* Кнопка "Просмотрено" внутри избранного */}
                <button
                  onClick={handleViewedAction}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all ${
                    isViewed 
                      ? "bg-green-500 text-white" 
                      : "bg-white text-slate-400"
                  }`}
                >
                  <Eye className="w-6 h-6" />
                </button>

                {/* Кнопка "Убрать из избранного" */}
                <button
                  onClick={handleRemoveFromFavorites}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ЗАГРУЗКА (ЛОАДЕР) */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== ЭКРАН ИНФОРМАЦИИ ===== */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 z-50 bg-white rounded-[28px] flex flex-col"
            >
              <div className="relative h-14 shrink-0">
                <button
                  onClick={(e) => handleInfoToggle(e, false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-6 no-scrollbar">
                <h2 className="text-xl font-bold mb-3 text-slate-900">
                  {currentMovie.title}
                </h2>

                <div className="flex gap-4 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-yellow-700">{currentMovie.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg">
                    <Globe className="w-4 h-4" />
                    {currentMovie.country}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                  {currentMovie.description}
                </p>

                <div className="space-y-3 text-sm text-slate-500 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <Film className="w-4 h-4 text-pink-500" />
                    <span><span className="font-medium text-slate-700">Режиссёр:</span> {currentMovie.director}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span><span className="font-medium text-slate-700">Длительность:</span> {currentMovie.duration} мин</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-pink-500" />
                    <span><span className="font-medium text-slate-700">Жанры:</span> {currentMovie.genre}</span>
                  </div>
                </div>
              </div>
              
              {/* Градиентный отступ внизу для красоты */}
              <div className="h-8 bg-gradient-to-t from-white to-transparent shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
