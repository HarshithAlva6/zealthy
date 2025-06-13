'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export type User = {
  id: string;
  email: string;
  created: string;
  completed?: string;
  onboarding?: number;
  about?: string;
  birthdate?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  userData?: any;
};

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersData = await api.get<User[]>('/users')
      setUsers(usersData)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return { users, loading, refetch: loadUsers }
}