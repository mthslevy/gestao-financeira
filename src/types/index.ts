/**
 * Tipos partilhados da aplicação.
 * Re-exporta domain e adiciona tipos de UI/contexto.
 */

export type {
  Category,
  Transaction,
  TransactionType,
  MonthlyReport,
  MonthlyReportByCategory,
} from '../domain/types'

/** Identificador das abas do dashboard */
export type TabId = 'dashboard' | 'receitas' | 'despesas' | 'categorias' | 'relatorio'

/** Estado mínimo para editar uma categoria no modal */
export interface EditCategoryState {
  id: string
  name: string
}

/** Opções de registo (nome e apelido para user_metadata) */
export interface AuthSignUpOptions {
  firstName: string
  lastName: string
}

/** Resultado de signIn/signUp: erro ou sucesso */
export interface AuthResult {
  error: Error | null
}
