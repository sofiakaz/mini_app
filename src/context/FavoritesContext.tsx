async function loadFavorites() {
  console.log('📥 Загрузка избранного для user:', userId)
  
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('❌ Ошибка загрузки избранного:', error)
      return
    }
    
    console.log('✅ Загружено избранное:', data)
    
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
      setFavorites(movies)
    }
  } catch (err) {
    console.error('❌ Критическая ошибка:', err)
  }
}

const addToFavorites = async (movie: Movie) => {
  console.log('➕ Добавление в избранное:', movie.title)
  
  try {
    const { error } = await supabase.from('favorites').upsert({
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
    
    if (error) {
      console.error('❌ Ошибка добавления:', error)
      return
    }
    
    console.log('✅ Добавлено в Supabase')
    
    setFavorites((prev) =>
      prev.some((m) => m.title === movie.title) ? prev : [...prev, movie]
    )
  } catch (err) {
    console.error('❌ Критическая ошибка при добавлении:', err)
  }
}
