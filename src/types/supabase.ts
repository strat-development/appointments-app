export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "business-images": {
        Row: {
          business_id: string | null
          id: number
          image_url: string
        }
        Insert: {
          business_id?: string | null
          id?: number
          image_url: string
        }
        Update: {
          business_id?: string | null
          id?: number
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_business-images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business-info"
            referencedColumns: ["id"]
          }
        ]
      }
      "business-info": {
        Row: {
          business_address: string | null
          business_email: string | null
          business_name: string | null
          business_owner: string | null
          business_phone_number: string | null
          id: string
        }
        Insert: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_owner?: string | null
          business_phone_number?: string | null
          id?: string
        }
        Update: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_owner?: string | null
          business_phone_number?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_business-info_business_owner_fkey"
            columns: ["business_owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      "business-opening-hours": {
        Row: {
          business_name: string | null
          id: number
          opening_hours: Json | null
        }
        Insert: {
          business_name?: string | null
          id?: number
          opening_hours?: Json | null
        }
        Update: {
          business_name?: string | null
          id?: number
          opening_hours?: Json | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          business_name: string | null
          client_description: string | null
          client_id: string
          email: string | null
          full_name: string | null
          label: string | null
          phone_number: string | null
          visit_count: number | null
        }
        Insert: {
          business_name?: string | null
          client_description?: string | null
          client_id?: string
          email?: string | null
          full_name?: string | null
          label?: string | null
          phone_number?: string | null
          visit_count?: number | null
        }
        Update: {
          business_name?: string | null
          client_description?: string | null
          client_id?: string
          email?: string | null
          full_name?: string | null
          label?: string | null
          phone_number?: string | null
          visit_count?: number | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          business_name: string | null
          email: string | null
          employee_id: string
          employer_id: string | null
          full_name: string | null
          label: string | null
          phone_number: string | null
        }
        Insert: {
          business_name?: string | null
          email?: string | null
          employee_id?: string
          employer_id?: string | null
          full_name?: string | null
          label?: string | null
          phone_number?: string | null
        }
        Update: {
          business_name?: string | null
          email?: string | null
          employee_id?: string
          employer_id?: string | null
          full_name?: string | null
          label?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_employees_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employer"
            referencedColumns: ["id"]
          }
        ]
      }
      employer: {
        Row: {
          business_id: string | null
          client_id: string | null
          full_name: string
          id: string
        }
        Insert: {
          business_id?: string | null
          client_id?: string | null
          full_name: string
          id?: string
        }
        Update: {
          business_id?: string | null
          client_id?: string | null
          full_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_employer_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business-info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_employer_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          }
        ]
      }
      positions: {
        Row: {
          business_id: string | null
          employee_id: string | null
          position_id: number
          position_name: string
        }
        Insert: {
          business_id?: string | null
          employee_id?: string | null
          position_id?: number
          position_name: string
        }
        Update: {
          business_id?: string | null
          employee_id?: string | null
          position_id?: number
          position_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_positions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business-info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_positions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          }
        ]
      }
      services: {
        Row: {
          business_name: string
          duration: string
          price: string
          service_id: number
          title: string
        }
        Insert: {
          business_name: string
          duration: string
          price: string
          service_id?: number
          title: string
        }
        Update: {
          business_name?: string
          duration?: string
          price?: string
          service_id?: number
          title?: string
        }
        Relationships: []
      }
      socials: {
        Row: {
          business_name: string
          id: number
          socials_data: Json | null
        }
        Insert: {
          business_name: string
          id?: number
          socials_data?: Json | null
        }
        Update: {
          business_name?: string
          id?: number
          socials_data?: Json | null
        }
        Relationships: []
      }
      "stripe-customers": {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      "stripe-prices": {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "stripe-products"
            referencedColumns: ["id"]
          }
        ]
      }
      "stripe-products": {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      "stripe-subscriptions": {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "stripe-prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          email: string | null
          full_name: string | null
          id: string
          payment_method: Json | null
          phone_number: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          email?: string | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
          phone_number?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          email?: string | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
          phone_number?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      visits: {
        Row: {
          business_id: string | null
          client_description: string | null
          client_id: string | null
          end_time: string | null
          label: string | null
          phone_number: string | null
          service: string | null
          start_time: string | null
          status: string | null
          user_id: string | null
          visit_id: number
        }
        Insert: {
          business_id?: string | null
          client_description?: string | null
          client_id?: string | null
          end_time?: string | null
          label?: string | null
          phone_number?: string | null
          service?: string | null
          start_time?: string | null
          status?: string | null
          user_id?: string | null
          visit_id?: number
        }
        Update: {
          business_id?: string | null
          client_description?: string | null
          client_id?: string | null
          end_time?: string | null
          label?: string | null
          phone_number?: string | null
          service?: string | null
          start_time?: string | null
          status?: string | null
          user_id?: string | null
          visit_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business-info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_hours_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_visits_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
