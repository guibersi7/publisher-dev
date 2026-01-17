import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

let client: any = null

export const createClient = () => {
  if (client) return client

  client = createClientComponentClient()

  return client
}
