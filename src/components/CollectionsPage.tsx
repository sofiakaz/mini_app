import { movies } from "../data/movies"

const collections = [
  {
    id: "calm",
    title: "Для спокойного вечера",
    description:
      "Фильмы, которые приятно смотреть медленно, с чаем и пледом.",
    movies: movies.slice(0, 6),
  },
  {
    id: "thrill",
    title: "Пощекотать нервы",
    description:
      "Напряжённые и атмосферные фильмы, от которых сложно оторваться.",
    movies: movies.slice(6, 12),
  },
  {
    id: "feelgood",
    title: "Поднять настроение",
    description:
      "Лёгкие и тёплые истории, после которых становится чуть счастливее.",
    movies: movies.slice(12, 18),
  },
]

export function CollectionsPage() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pt-16 pb-8 px-4">
      {/* ХЭДЕР */}
      <div className="pt-14 px-5 pb-6">
        <h1 className="text-2xl font-semibold">Подборки</h1>
      </div>

      {/* КОНТЕНТ */}
      <div className="px-4 space-y-8">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-3">
              {collection.title}
            </h2>

            <div className="flex gap-3 overflow-x-auto mb-3 no-scrollbar">
              {collection.movies.map((movie) => (
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
        ))}
      </div>
    </div>
  )
}
