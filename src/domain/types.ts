/**
 * Tipo de movimento financeiro: receita ou despesa.
 */
export type TransactionType = 'receita' | 'despesa'

/**
 * Categoria para agrupar receitas ou despesas.
 */
export interface Category {
  id: string
  name: string
  type: TransactionType
  color?: string
}

/**
 * Transação (receita ou despesa) com data e categoria.
 */
export interface Transaction {
  id: string
  type: TransactionType
  description: string
  amount: number
  categoryId: string
  /** Data em ISO (YYYY-MM-DD) */
  date: string
  /** Data de criação em ISO datetime */
  createdAt: string
}

/** Entrada do relatório por categoria */
export interface MonthlyReportByCategory {
  categoryId: string
  categoryName: string
  type: TransactionType
  total: number
  count: number
}

/**
 * Relatório mensal: totais, listas e agrupamento por categoria.
 */
export interface MonthlyReport {
  year: number
  month: number
  totalReceitas: number
  totalDespesas: number
  saldo: number
  receitas: Transaction[]
  despesas: Transaction[]
  byCategory: MonthlyReportByCategory[]
}
