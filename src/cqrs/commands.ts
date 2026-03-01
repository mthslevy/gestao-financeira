import type { Category, Transaction, TransactionType } from '../domain/types'
import * as db from '../db/supabase-store'

function genId(): string {
  return crypto.randomUUID()
}

export async function createCategory(name: string, type: TransactionType): Promise<Category> {
  const category: Category = {
    id: genId(),
    name,
    type,
  }
  await db.insertCategory(category)
  return category
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const cat = await db.getCategoryById(id)
  if (!cat) return
  await db.updateCategory(id, name)
}

export async function deleteCategory(id: string): Promise<void> {
  await db.deleteCategory(id)
}

export async function createReceita(
  description: string,
  amount: number,
  categoryId: string,
  date: string
): Promise<Transaction> {
  const tx: Transaction = {
    id: genId(),
    type: 'receita',
    description,
    amount,
    categoryId,
    date,
    createdAt: new Date().toISOString(),
  }
  await db.insertTransaction(tx)
  return tx
}

export async function createDespesa(
  description: string,
  amount: number,
  categoryId: string,
  date: string
): Promise<Transaction> {
  const tx: Transaction = {
    id: genId(),
    type: 'despesa',
    description,
    amount,
    categoryId,
    date,
    createdAt: new Date().toISOString(),
  }
  await db.insertTransaction(tx)
  return tx
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<Transaction, 'description' | 'amount' | 'categoryId' | 'date'>>
): Promise<void> {
  await db.updateTransaction(id, data)
}

export async function deleteTransaction(id: string): Promise<void> {
  await db.deleteTransaction(id)
}
