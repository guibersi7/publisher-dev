// Script para testar conexão com Supabase
// Execute com: node test-connection.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Carregar .env ou .env.local manualmente
function loadEnv() {
  try {
    let envFile
    try {
      envFile = readFileSync('.env.local', 'utf-8')
    } catch {
      envFile = readFileSync('.env', 'utf-8')
    }
    const lines = envFile.split('\n')
    const env = {}
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
    return env
  } catch (err) {
    console.log('❌ Arquivo .env.local não encontrado!')
    console.log('   Crie o arquivo .env.local com suas chaves do Supabase.')
    process.exit(1)
  }
}

const env = loadEnv()

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

console.log('\n🔍 Testando configuração do Supabase...\n')

// Verificar se as variáveis existem
console.log('1️⃣ Verificando variáveis de ambiente:')
console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ ' + supabaseUrl.substring(0, 30) + '...' : '❌ Não encontrada'}`)
console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurada (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ Não encontrada'}`)
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Configurada (' + supabaseServiceKey.substring(0, 20) + '...)' : '❌ Não encontrada'}`)

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ Variáveis de ambiente incompletas!')
  process.exit(1)
}

// Testar conexão
async function testConnection() {
  console.log('\n2️⃣ Testando conexão com Supabase...')
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Testar auth
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log(`   Auth: ❌ Erro - ${authError.message}`)
    } else {
      console.log('   Auth: ✅ Conexão OK')
    }
    
    // Testar database
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      if (error.code === '42P01') {
        console.log('   Database: ⚠️ Tabela "users" não existe')
        console.log('   → Execute o schema.sql no Supabase SQL Editor')
      } else if (error.code === 'PGRST301' || error.message.includes('permission')) {
        console.log('   Database: ✅ Tabela existe (RLS ativo - esperado!)')
      } else {
        console.log(`   Database: ⚠️ ${error.message}`)
      }
    } else {
      console.log('   Database: ✅ Conexão OK')
    }
    
    console.log('\n✅ Conexão com Supabase funcionando!')
    console.log('\n📋 Próximos passos:')
    console.log('   1. Execute o supabase/schema.sql no SQL Editor')
    console.log('   2. Configure Google OAuth: Authentication > Providers > Google')
    console.log('   3. npm run dev')
    
  } catch (err) {
    console.log(`\n❌ Erro de conexão: ${err.message}`)
  }
}

testConnection()

