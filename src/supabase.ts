import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvqdnemgrlimzdxbdzjl.supabase.co'
const supabaseKey = 'твой-ключ' // Убедись, что ключ правильный!

export const supabase = createClient(supabaseUrl, supabaseKey)

// ТЕСТ: проверим подключение
supabase.from('favorites').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Ошибка подключения к Supabase:', error.message)
    } else {
      console.log('✅ Подключение к Supabase работает!')
    }
  })

export function getUserId(): string {
  // Проверяем, что мы в Telegram
  if (typeof window !== 'undefined') {
    try {
      const tg = (window as any).Telegram?.WebApp
      if (tg?.initDataUnsafe?.user?.id) {
        const userId = `tg_${tg.initDataUnsafe.user.id}`
        console.log('👤 Telegram user ID:', userId)
        return userId
      }
    } catch (e) {
      console.warn('Telegram WebApp не доступен')
    }
    
    // Браузер (локальная разработка)
    let userId = localStorage.getItem('movie_app_user_id')
    if (!userId) {
      userId = `guest_${crypto.randomUUID()}`
      localStorage.setItem('movie_app_user_id', userId)
    }
    console.log('👤 Guest user ID:', userId)
    return userId
  }
  
  return `guest_${Date.now()}`
}
