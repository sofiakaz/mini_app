import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvqdnemgrlimzdxbdzjl.supabase.co' // замени на реальный из Supabase → Settings → API → Project URL
const supabaseKey = 'sb_publishable_Cl0YT6GnpaBnXCalgq2qYw_vk-TKbbh' // замени на реальный из Supabase → Settings → API → anon public key

export const supabase = createClient(supabaseUrl, supabaseKey)

// Получить ID пользователя (Telegram или гость)
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
