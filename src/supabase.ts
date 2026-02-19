import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'ТВОЙ_SUPABASE_URL' // заменишь позже
const supabaseKey = 'ТВОЙ_SUPABASE_ANON_KEY' // заменишь позже

export const supabase = createClient(supabaseUrl, supabaseKey)

// Получить ID пользователя
export function getUserId(): string {
  // Telegram
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  if (tgUser?.id) {
    return `tg_${tgUser.id}`
  }
  
  // Браузер (fallback)
  let userId = localStorage.getItem('movie_app_user_id')
  if (!userId) {
    userId = `guest_${crypto.randomUUID()}`
    localStorage.setItem('movie_app_user_id', userId)
  }
  return userId
}