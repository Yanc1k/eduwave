export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      plans: {
        Row: {
          id: string
          name: string
          price_text: string
          price_numeric: number
          description: string
          features: string[]
          cta: string
          highlight: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price_text: string
          price_numeric: number
          description: string
          features: string[]
          cta?: string
          highlight?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_text?: string
          price_numeric?: number
          description?: string
          features?: string[]
          cta?: string
          highlight?: boolean
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_name: string
          status: string
          payment_method: string
          amount_paid: number
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_name: string
          status?: string
          payment_method: string
          amount_paid: number
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: string
          status?: string
          payment_method?: string
          amount_paid?: number
          created_at?: string
          expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_name_fkey"
            columns: ["plan_name"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["name"]
          }
        ]
      }
      courses: {
        Row: {
          id: string
          name: string
          emoji: string
          tag: string
          price: number
          old_price: number | null
          badge: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          tag: string
          price?: number
          old_price?: number | null
          badge?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          tag?: string
          price?: number
          old_price?: number | null
          badge?: string | null
          created_at?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          id: string
          course_name: string
          lesson_number: number
          title: string
          duration: string
          is_trial: boolean
          theory: string
          video_url: string
          question: string
          options: string[]
          correct_answer: string
          is_playground: boolean
          playground_template: string | null
          playground_task: string | null
          custom_visual_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_name: string
          lesson_number: number
          title: string
          duration: string
          is_trial?: boolean
          theory: string
          video_url?: string
          question: string
          options: string[]
          correct_answer: string
          is_playground?: boolean
          playground_template?: string | null
          playground_task?: string | null
          custom_visual_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_name?: string
          lesson_number?: number
          title?: string
          duration?: string
          is_trial?: boolean
          theory?: string
          video_url?: string
          question?: string
          options?: string[]
          correct_answer?: string
          is_playground?: boolean
          playground_template?: string | null
          playground_task?: string | null
          custom_visual_type?: string | null
          created_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string
          course_name: string
          id: string
          user_id: string
          is_paid: boolean
        }
        Insert: {
          created_at?: string
          course_name: string
          id?: string
          user_id: string
          is_paid?: boolean
        }
        Update: {
          created_at?: string
          course_name?: string
          id?: string
          user_id?: string
          is_paid?: boolean
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          created_at: string
          course_name: string
          id: string
          lesson_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          course_name: string
          id?: string
          lesson_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          course_name?: string
          id?: string
          lesson_id?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          avatar_url: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          avatar_url?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
