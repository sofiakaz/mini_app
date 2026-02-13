import { useState } from "react"
import { movies } from "../data/movies"
import { MovieCard } from "./MovieCard"
import type { Movie } from "./MovieCard"
import { ArrowLeft } from "lucide-react"  // Добавлено для кнопки "Назад"

const collections = [
  {
    id: "calm",
    title: "Для спокойного вечера",
    description:
      "Фильмы, которые приятно смотреть медленно, с чаем и пледом.",
    movieIds: [942, 1034, 1070, 1663, 756, 1095, 1643, 1677],  // Теперь это IDs фильмов
  },
  {
    id: "thrill",
    title: "Пощекотать нервы",
    description:
      "Напряжённые и атмосферные фильмы, от которых сложно оторваться.",
    movieIds: [1220, 1444, 1172, 884, 911, 1206, 549, 952],  // IDs
  },
  {
    id: "feelbad",
    title: "Поплакать",
    description:
      "Истории, которые заставляют сопереживать, чувствовать и переживать вместе с героями их радости и потери.",
    movieIds: [957, 847, 865, 81, 845, 785, 931, 873],  // IDs
  },
]

interface Props {
  onSelectCollection: (collectionId: string) => void
  selectedCollection: string | null
  onBack: () => void
  onLike: (movie: Movie) => void
  onViewed: (movie: Movie) => void
  isViewed: (title: string) => boolean
}

export function CollectionsPage({
  onSelectCollection,
  selectedCollection,
  onBack,
  onLike,
  onViewed,
  isViewed,
}: Props) {
  const [collectionIndex, setCollectionIndex] = useState(0)

  const selectedColl = collections.find((c) => c.id === selectedCollection)
  // Используем type guard для фильтрации, чтобы TypeScript правильно определил тип
  const collectionMovies = selectedColl ? selectedColl.movieIds.map(id => movies.find(movie => movie.id === id)).filter((m): m is typeof movies[0] => m !== undefined) : []
  const movie = collectionMovies[collectionIndex % Math.max(collectionMovies.length, 1)]

  const mappedMovie: Movie | null = movie
    ? {
        title: movie.title || 'Unknown Title',  // Дефолт, чтобы избежать пустой строки
        year: movie.year || 0,
        country: movie.country || "—",
        poster: movie.poster || '',
        rating: movie.vote_average || 0,
        description: movie.description || '',
        director: movie.director || '',
        duration: movie.duration || 0,
        genre: formatGenres(movie.genres || []),
      }
    : null

  // Вспомогательная функция (из App.tsx)
  function formatGenres(genres: string[]) {
    if (genres.length === 1) return genres[0]
    if (genres.length === 2) return `${genres[0]} и ${genres[1]}`
    return `${genres.slice(0, -1).join(", ")} и ${genres.at(-1)}`
  }

  if (selectedCollection && selectedColl) {
    // Режим ленты для выбранной подборки
    return (
      <div className="relative h-full pt-40 flex justify-center bg-gradient-to-b from-rose-200 via-pink-100 to-neutral-200 pb-4">  {/* pt-32 для карточек ниже, pb-20 для bottom bar */}
        {/* Кнопка "Назад" */}
        <button
          onClick={onBack}
          className="absolute top-24 left-6 z-30 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Карточка фильма */}
        {mappedMovie && (
          <MovieCard
            movie={mappedMovie}
            onLike={() => {
              onLike(mappedMovie)
              setCollectionIndex((i) => i + 1)
            }}
            onDislike={() => setCollectionIndex((i) => i + 1)}
            onViewed={() => {
              onViewed(mappedMovie)
              setCollectionIndex((i) => i + 1)
            }}
            isViewed={mappedMovie.title ? isViewed(mappedMovie.title) : false}  // Проверка, чтобы title не был пустым
          />
        )}
      </div>
    )
  }

  // Режим списка подборок
  return (
    <div className="relative h-full bg-gradient-to-b from-rose-200 via-pink-100 to-neutral-200 pb-4">  {/* pb-20 для bottom bar */}
      {/* Хедер закреплен наверху */}  {/* Изменено: absolute top-0 для закрепления наверху */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-rose-200 via-rose-200 to-rose-180 px-5 py-6">
        <h1 className="text-3xl font-bold">Подборки</h1>
      </div>

      {/* Скроллируемый контент */}
      <div className="overflow-y-auto no-scrollbar pt-20 px-4 pb-4 h-full">  {/* Изменено: pt-20 (80px) для отступа под хедер, pb-20 для bottom bar */}
        <div className="px-4 space-y-8">
          {collections.map((collection) => {
            // Аналогично фильтруем для постеров
            const collectionMovies = collection.movieIds.map(id => movies.find(movie => movie.id === id)).filter((m): m is typeof movies[0] => m !== undefined)
            if (collectionMovies.length === 0) {
              return (
                <div key={collection.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3">{collection.title}</h2>
                  <p className="text-sm text-gray-500">Фильмы не найдены. Проверьте IDs.</p>
                </div>
              )
            }
            return (
              <div
                key={collection.id}
                onClick={() => onSelectCollection(collection.id)}
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-3">
                  {collection.title}
                </h2>

                <div className="flex gap-3 overflow-x-auto mb-3 no-scrollbar">
                  {collectionMovies.map((movie) => (
                    <img
                      key={movie.title}
                      src={movie.poster}
                      alt={movie.title}
                      className="w-20 h-30 object-cover rounded-xl flex-shrink-0"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {collection.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
