import type { Category, MonthlyReport, Transaction } from '../domain/types'
import * as db from '../db/supabase-store'

/** Read model: categories */
export async function getCategories(type?: 'receita' | 'despesa'): Promise<Category[]> {
  const list = await db.getAllCategories()
  if (type) return list.filter((c) => c.type === type)
  return list
}

/** Read model: all transactions */
export async function getTransactions(): Promise<Transaction[]> {
  return db.getAllTransactions()
}

/** Replica: monthly report (read model for relatório) */
export async function getMonthlyReport(year: number, month: number): Promise<MonthlyReport> {
  const transactions = await db.getTransactionsByMonth(year, month)
  const categories = await db.getAllCategories()
  const catMap = new Map(categories.map((c) => [c.id, c]))

  const receitas = transactions.filter((t) => t.type === 'receita')
  const despesas = transactions.filter((t) => t.type === 'despesa')
  const totalReceitas = receitas.reduce((s, t) => s + t.amount, 0)
  const totalDespesas = despesas.reduce((s, t) => s + t.amount, 0)
  const saldo = totalReceitas - totalDespesas

  const byCategoryMap = new Map<
    string,
    { categoryId: string; categoryName: string; type: 'receita' | 'despesa'; total: number; count: number }
  >()
  for (const t of transactions) {
    const key = `${t.type}-${t.categoryId}`
    const cur = byCategoryMap.get(key)
    const name = catMap.get(t.categoryId)?.name ?? 'Sem categoria'
    if (cur) {
      cur.total += t.amount
      cur.count += 1
    } else {
      byCategoryMap.set(key, {
        categoryId: t.categoryId,
        categoryName: name,
        type: t.type,
        total: t.amount,
        count: 1,
      })
    }
  }

  const byCategory = Array.from(byCategoryMap.values())

  return {
    year,
    month,
    totalReceitas,
    totalDespesas,
    saldo,
    receitas,
    despesas,
    byCategory,
  }
}
