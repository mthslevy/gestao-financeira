import { useCallback, useEffect, useState } from 'react'
import type { Category, MonthlyReport, Transaction } from '../domain/types'
import * as commands from '../cqrs/commands'
import * as queries from '../cqrs/queries'
import { useAuth } from '../contexts/AuthContext'

export function useCategories(type?: 'receita' | 'despesa') {
  const { user } = useAuth()
  const [list, setList] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getCategories(type)
      setList(data)
    } catch (e) {
      console.warn('Erro ao carregar categorias:', e)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    if (user) {
      load()
    } else {
      setList([])
      setLoading(false)
    }
  }, [user, load])

  const create = useCallback(
    async (name: string, t: 'receita' | 'despesa') => {
      await commands.createCategory(name, t)
      await load()
    },
    [load]
  )

  const update = useCallback(
    async (id: string, name: string) => {
      await commands.updateCategory(id, name)
      await load()
    },
    [load]
  )

  const remove = useCallback(
    async (id: string) => {
      await commands.deleteCategory(id)
      await load()
    },
    [load]
  )

  return { list, loading, create, update, remove, refresh: load }
}

export function useTransactions() {
  const { user } = useAuth()
  const [list, setList] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getTransactions()
      setList(data)
    } catch (e) {
      console.warn('Erro ao carregar transações:', e)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      load()
    } else {
      setList([])
      setLoading(false)
    }
  }, [user, load])

  const addReceita = useCallback(
    async (description: string, amount: number, categoryId: string, date: string) => {
      await commands.createReceita(description, amount, categoryId, date)
      await load()
    },
    [load]
  )

  const addDespesa = useCallback(
    async (description: string, amount: number, categoryId: string, date: string) => {
      await commands.createDespesa(description, amount, categoryId, date)
      await load()
    },
    [load]
  )

  const update = useCallback(
    async (
      id: string,
      data: Partial<Pick<Transaction, 'description' | 'amount' | 'categoryId' | 'date'>>
    ) => {
      await commands.updateTransaction(id, data)
      await load()
    },
    [load]
  )

  const remove = useCallback(
    async (id: string) => {
      await commands.deleteTransaction(id)
      await load()
    },
    [load]
  )

  return { list, loading, addReceita, addDespesa, update, remove, refresh: load }
}

export function useMonthlyReport(year: number, month: number) {
  const { user } = useAuth()
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await queries.getMonthlyReport(year, month)
      setReport(data)
    } catch (e) {
      console.warn('Erro ao carregar relatório:', e)
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => {
    if (user) {
      load()
    } else {
      setReport(null)
      setLoading(false)
    }
  }, [user, load])

  return { report, loading, refresh: load }
}
