import { Heart, Layers, Film } from "lucide-react"

type View = "feed" | "favorites" | "collections"

export function BottomBar({
  view,
  setView,
}: {
  view: View
  setView: (v: View) => void
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur border-t flex items-center justify-around">  {/* Оставлено absolute для фиксации к нижней части экрана */}
      {/* Подборки */}
      <button
        onClick={() => setView("collections")}
        className={`flex flex-col items-center ${
          view === "collections" ? "text-pink-500" : "text-gray-600"
        }`}
      >
        <Layers className="w-6 h-6 mb-1" />
        <span className="text-xs">Подборки</span>
      </button>

      {/* Лента */}
      <button
        onClick={() => setView("feed")}
        className="-mt-8 w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-xl flex items-center justify-center"
      >
        <Film className="w-9 h-9 text-white" />
      </button>

      {/* Избранное */}
      <button
        onClick={() => setView("favorites")}
        className={`flex flex-col items-center ${
          view === "favorites" ? "text-red-500" : "text-gray-600"
        }`}
      >
        <Heart className="w-6 h-6 mb-1" />
        <span className="text-xs">Избранное</span>
      </button>
    </div>
  )
}
