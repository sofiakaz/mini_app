import type { Movie } from "../components/MovieCard"

export interface Collection {
  id: string
  title: string
  description: string
  movies: Movie[]
}

export const collections: Collection[] = [
  {
    id: "cozy",
    title: "🌿 Уютный вечер",
    description:
      "Тёплые фильмы для спокойного вечера с чаем и пледом. Без резких эмоций.",
    movies: [
      {
        title: "Амели",
        year: 2001,
        country: "Франция",
        poster: "https://www.themoviedb.org/t/p/w1280/k6aTGIysigjJIU7X72DBbdFkrWR.jpg",
        rating: 7.9,
        description: "",
        director: "",
        duration: 98,
        genre: "романтика",
      },
      {
        title: "Патерсон",
        year: 2016,
        country: "США",
        poster: "https://www.themoviedb.org/t/p/w1280/pGM4NX8F9hqDmxsc9xFuVHqxE6X.jpg",
        rating: 7.4,
        description: "",
        director: "",
        duration: 100,
        genre: "драма",
      },
    ],
  },

  {
    id: "think",
    title: "🧠 Фильмы для размышлений",
    description:
      "После этих фильмов хочется молчать и думать. Не включай фоном.",
    movies: [
      {
        title: "Прибытие",
        year: 2016,
        country: "США",
        poster: "https://image.tmdb.org/t/p/w300/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
        rating: 7.6,
        description: "",
        director: "",
        duration: 100,
        genre: "фантастика",
      },
      {
        title: "Она",
        year: 2013,
        country: "США",
        poster: "https://image.tmdb.org/t/p/w300/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
        rating: 8.0,
        description: "",
        director: "",
        duration: 73,
        genre: "драма",
      },
    ],
  },
]
