import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvqdnemgrlimzdxbdzjl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cWRuZW1ncmxpbXpkeGJkempsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjI4MzEsImV4cCI6MjA4NzA5ODgzMX0.lbr5DopcgRmzZWUS0ts8cLyIlAexhNjymPEF8pbKOwE'

// ВАЖНО: передаем ключ явно с заголовками
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  }
})

export function getUserId(): string {
  try {
    // Telegram
    const tg = (window as any).Telegram?.WebApp
    if (tg?.initDataUnsafe?.user?.id) {
      return `tg_${tg.initDataUnsafe.user.id}`
    }
    
    // Браузер (fallback)
    let userId = localStorage.getItem('movie_app_user_id')
    if (!userId) {
      userId = `guest_${crypto.randomUUID()}`
      localStorage.setItem('movie_app_user_id', userId)
    }
    return userId
  } catch {
    return `guest_${Date.now()}`
  }
}
