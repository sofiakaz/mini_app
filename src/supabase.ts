console.log('🔥🔥🔥 СУПЕР ВАЖНО: Я ВНУТРИ supabase.ts');
console.log('Время:', new Date().toISOString());
console.log('URL страницы:', window.location.href);

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvqdnemgrlimzdxbdzjl.supabase.co'
const supabaseKey = 'тут все есть, просто тебе не скидываю'

console.log('URL загружен:', supabaseUrl);
console.log('Ключ загружен, длина:', supabaseKey?.length);

export const supabase = createClient(supabaseUrl, supabaseKey)
console.log('Клиент Supabase создан:', !!supabase);

// Тест подключения
supabase.from('favorites').select('count', { count: 'exact', head: true })
  .then(() => console.log('✅ Тест подключения прошел успешно'))
  .catch(err => console.log('❌ Тест подключения провалился:', err.message))

export function getUserId(): string {
  console.log('🆔 getUserId вызван');
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
