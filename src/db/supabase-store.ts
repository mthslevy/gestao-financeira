import type { Category, Transaction } from '../domain/types'
import { supabase } from '../lib/supabase'

// RLS ativo no Supabase: categories e transactions filtram por user_id (auth.uid()).
// Sempre enviar user_id nos inserts para o utilizador logado ser o dono dos dados.
const CATEGORIES = 'categories'
const TRANSACTIONS = 'transactions'

type CategoryRow = { id: string; name: string; type: string }
type TransactionRow = {
  id: string
  type: string
  description: string
  amount: number
  category_id: string
  date: string
  created_at: string
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Category['type'],
  }
}

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as Transaction['type'],
    description: row.description,
    amount: Number(row.amount),
    categoryId: row.category_id,
    date: row.date,
    createdAt: row.created_at,
  }
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from(CATEGORIES).select('*').order('name')
  if (error) {
    console.warn('Supabase categories:', error.message)
    return []
  }
  return (data ?? []).map(toCategory)
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const { data, error } = await supabase.from(CATEGORIES).select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return undefined
    throw error
  }
  return data ? toCategory(data as CategoryRow) : undefined
}

export async function insertCategory(category: Category): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const { error } = await supabase.from(CATEGORIES).insert({
    id: category.id,
    name: category.name,
    type: category.type,
    user_id: user.id,
  })
  if (error) throw error
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const { error } = await supabase.from(CATEGORIES).update({ name }).eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from(CATEGORIES).delete().eq('id', id)
  if (error) throw error
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from(TRANSACTIONS)
    .select('*')
    .order('date', { ascending: false })
  if (error) {
    console.warn('Supabase transactions:', error.message)
    return []
  }
  return (data ?? []).map((r) => toTransaction(r as TransactionRow))
}

export async function getTransactionById(id: string): Promise<Transaction | undefined> {
  const { data, error } = await supabase.from(TRANSACTIONS).select('*').eq('id', id).single()
  if (error) {
    if (error.code === 'PGRST116') return undefined
    throw error
  }
  return data ? toTransaction(data as TransactionRow) : undefined
}

export async function getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data, error } = await supabase
    .from(TRANSACTIONS)
    .select('*')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: false })
  if (error) {
    console.warn('Supabase transactions by month:', error.message)
    return []
  }
  return (data ?? []).map((r) => toTransaction(r as TransactionRow))
}

export async function insertTransaction(tx: Transaction): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  const amount = Number(tx.amount)
  const { error } = await supabase.from(TRANSACTIONS).insert({
    id: tx.id,
    type: tx.type,
    description: tx.description,
    amount,
    category_id: tx.categoryId,
    date: tx.date,
    created_at: tx.createdAt,
    user_id: user.id,
  })
  if (error) throw error
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<Transaction, 'description' | 'amount' | 'categoryId' | 'date'>>
): Promise<void> {
  const row: Partial<TransactionRow> = {}
  if (data.description != null) row.description = data.description
  if (data.amount != null) row.amount = Number(data.amount)
  if (data.categoryId != null) row.category_id = data.categoryId
  if (data.date != null) row.date = data.date
  if (Object.keys(row).length === 0) return
  const { error } = await supabase.from(TRANSACTIONS).update(row).eq('id', id)
  if (error) throw error
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from(TRANSACTIONS).delete().eq('id', id)
  if (error) throw error
}
