import { createClient } from '@supabase/supabase-js'
import cache from 'memory-cache'

const supabase = createClient('https://yvargccllzgzjbkoypba.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YXJnY2NsbHpnempia295cGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2NjUxMjksImV4cCI6MTk5NjI0MTEyOX0.s--34SjoqnxWh4kmC0s16UbHADMP_vWIHlEs9gVmsjM')

export async function getUserPass(pass: string, force = false) {
  const cachePass = cache.get(pass)
  if (cachePass && !force) {
    global.console.log('user cache pass')
    return JSON.parse(cachePass)
  }
  const { data } = await supabase.from('user_pass_key').select().eq('pass', pass)
  const userPass = data[0]
  if (userPass)
    cache.put(pass, JSON.stringify(userPass), 60 * 60 * 12 * 1000)
  return userPass
}
