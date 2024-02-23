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
          business_name: string
          id: number
          image_url: string
        }
        Insert: {
          business_name: string
          id?: number
          image_url: string
        }
        Update: {
          business_name?: string
          id?: number
          image_url?: string
        }
        Relationships: []
      }
      "business-info": {
        Row: {
          business_address: string | null
          business_email: string | null
          business_name: string | null
          business_owner: string | null
          business_phone_number: string | null
          id: number
        }
        Insert: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_owner?: string | null
          business_phone_number?: string | null
          id?: number
        }
        Update: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_owner?: string | null
          business_phone_number?: string | null
          id?: number
        }
        Relationships: []
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
          description: string | null
          email: string | null
          employee_id: string | null
          full_name: string | null
          id: number
          label: string | null
          phone_number: string | null
        }
        Insert: {
          business_name?: string | null
          description?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
        }
        Update: {
          business_name?: string | null
          description?: string | null
          email?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
        }
        Relationships: []
      }
      hours: {
        Row: {
          description: string | null
          endTime: string | null
          id: number
          label: string | null
          phone_number: string | null
          service: string | null
          startTime: string | null
          status: string | null
          title: string | null
          userId: string | null
        }
        Insert: {
          description?: string | null
          endTime?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
          service?: string | null
          startTime?: string | null
          status?: string | null
          title?: string | null
          userId?: string | null
        }
        Update: {
          description?: string | null
          endTime?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
          service?: string | null
          startTime?: string | null
          status?: string | null
          title?: string | null
          userId?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          business_name: string
          id: number
          position_name: string
        }
        Insert: {
          business_name: string
          id?: number
          position_name: string
        }
        Update: {
          business_name?: string
          id?: number
          position_name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          business_name: string
          duration: string
          id: number
          price: string
          title: string
        }
        Insert: {
          business_name: string
          duration: string
          id?: number
          price: string
          title: string
        }
        Update: {
          business_name?: string
          duration?: string
          id?: number
          price?: string
          title?: string
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
      subordinates: {
        Row: {
          business_name: string | null
          email: string | null
          employer_id: string | null
          full_name: string | null
          id: number
          label: string | null
          phone_number: string | null
        }
        Insert: {
          business_name?: string | null
          email?: string | null
          employer_id?: string | null
          full_name?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
        }
        Update: {
          business_name?: string | null
          email?: string | null
          employer_id?: string | null
          full_name?: string | null
          id?: number
          label?: string | null
          phone_number?: string | null
        }
        Relationships: []
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
