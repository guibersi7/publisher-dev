// Script para testar conexão com Supabase
// Execute com: npx ts-node scripts/test-supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('\n🔍 Testando configuração do Supabase...\n')

// Verificar se as variáveis existem
console.log('1️⃣ Verificando variáveis de ambiente:')
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Não encontrada'}`)
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurada' : '❌ Não encontrada'}`)
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Configurada' : '❌ Não encontrada'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Variáveis de ambiente não configuradas!')
  console.log('   Certifique-se de que o arquivo .env.local existe e contém as chaves.')
  process.exit(1)
}

// Testar conexão com anon key
async function testConnection() {
  console.log('\n2️⃣ Testando conexão com Supabase...')
  
  try {
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
    
    // Testar auth
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log(`   Auth: ❌ Erro - ${authError.message}`)
    } else {
      console.log('   Auth: ✅ Conexão OK')
    }
    
    // Testar se tabela users existe
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        console.log('   Database: ⚠️ Tabela "users" não existe')
        console.log('   → Execute o schema.sql no Supabase SQL Editor')
      } else if (error.code === 'PGRST301') {
        console.log('   Database: ⚠️ Tabela "users" existe mas sem permissão (RLS ativo)')
        console.log('   → Isso é esperado! As políticas RLS estão funcionando.')
      } else {
        console.log(`   Database: ❌ Erro - ${error.message}`)
      }
    } else {
      console.log('   Database: ✅ Conexão OK')
    }
    
    console.log('\n✅ Teste concluído!')
    console.log('\n📋 Próximos passos:')
    console.log('   1. Execute o schema.sql no Supabase SQL Editor (se ainda não fez)')
    console.log('   2. Configure Google OAuth em Authentication > Providers > Google')
    console.log('   3. Rode npm run dev e acesse http://localhost:3000')
    
  } catch (err) {
    console.log(`\n❌ Erro de conexão: ${err}`)
  }
}

testConnection()

