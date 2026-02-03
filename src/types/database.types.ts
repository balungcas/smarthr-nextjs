export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'employee' | 'manager'
          first_name: string
          last_name: string
          phone: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'admin' | 'employee' | 'manager'
          first_name: string
          last_name: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'employee' | 'manager'
          first_name?: string
          last_name?: string
          phone?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      designations: {
        Row: {
          id: string
          name: string
          department_id: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          department_id: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          department_id?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          user_id: string
          employee_id: string
          department_id: string | null
          designation_id: string | null
          joining_date: string
          employment_type: 'full-time' | 'part-time' | 'contract' | 'intern'
          status: 'active' | 'inactive' | 'on-leave'
          manager_id: string | null
          salary: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_id: string
          department_id?: string | null
          designation_id?: string | null
          joining_date: string
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on-leave'
          manager_id?: string | null
          salary?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_id?: string
          department_id?: string | null
          designation_id?: string | null
          joining_date?: string
          employment_type?: 'full-time' | 'part-time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on-leave'
          manager_id?: string | null
          salary?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          client_id: string
          company_name: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          status: 'active' | 'inactive'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          company_name: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          status?: 'active' | 'inactive'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          company_name?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          status?: 'active' | 'inactive'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as we implement them
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
