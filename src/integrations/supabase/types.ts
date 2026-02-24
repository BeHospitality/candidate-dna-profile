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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_responses: {
        Row: {
          answer: Json
          assessment_id: string
          created_at: string
          id: string
          question_id: number
        }
        Insert: {
          answer: Json
          assessment_id: string
          created_at?: string
          id?: string
          question_id: number
        }
        Update: {
          answer?: Json
          assessment_id?: string
          created_at?: string
          id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          archetype: string
          archetype_scores: Json
          completed_at: string
          comprehensive_scores: Json | null
          created_at: string
          department_matches: Json | null
          dimension_scores: Json
          entry_mode: string
          geography_matches: Json | null
          id: string
          org_code: string | null
          sector_matches: Json | null
          token: string | null
          user_id: string | null
        }
        Insert: {
          archetype: string
          archetype_scores?: Json
          completed_at?: string
          comprehensive_scores?: Json | null
          created_at?: string
          department_matches?: Json | null
          dimension_scores?: Json
          entry_mode?: string
          geography_matches?: Json | null
          id?: string
          org_code?: string | null
          sector_matches?: Json | null
          token?: string | null
          user_id?: string | null
        }
        Update: {
          archetype?: string
          archetype_scores?: Json
          completed_at?: string
          comprehensive_scores?: Json | null
          created_at?: string
          department_matches?: Json | null
          dimension_scores?: Json
          entry_mode?: string
          geography_matches?: Json | null
          id?: string
          org_code?: string | null
          sector_matches?: Json | null
          token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          actor_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      career_milestones: {
        Row: {
          assessment_id: string
          created_at: string
          description: string | null
          id: string
          sort_order: number
          title: string
          user_id: string | null
          year: number | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title: string
          user_id?: string | null
          year?: number | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          title?: string
          user_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "career_milestones_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      dna_participants: {
        Row: {
          assessment_id: string | null
          assessment_path: string | null
          completed_at: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          referral_source: string | null
          role_title: string | null
        }
        Insert: {
          assessment_id?: string | null
          assessment_path?: string | null
          completed_at?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          referral_source?: string | null
          role_title?: string | null
        }
        Update: {
          assessment_id?: string | null
          assessment_path?: string | null
          completed_at?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          referral_source?: string | null
          role_title?: string | null
        }
        Relationships: []
      }
      magic_links: {
        Row: {
          assessment_id: string | null
          candidate_email: string | null
          candidate_name: string | null
          created_at: string
          expire_at: string | null
          id: string
          org_code: string
          token: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          assessment_id?: string | null
          candidate_email?: string | null
          candidate_name?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          org_code: string
          token?: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          assessment_id?: string | null
          candidate_email?: string | null
          candidate_name?: string | null
          created_at?: string
          expire_at?: string | null
          id?: string
          org_code?: string
          token?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_links_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      motivators: {
        Row: {
          assessment_id: string
          category: string
          created_at: string
          id: string
          user_id: string | null
          value: string
        }
        Insert: {
          assessment_id: string
          category: string
          created_at?: string
          id?: string
          user_id?: string | null
          value: string
        }
        Update: {
          assessment_id?: string
          category?: string
          created_at?: string
          id?: string
          user_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "motivators_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          org_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          org_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          org_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_tokens: {
        Row: {
          answers: Json
          assessment_id: string | null
          created_at: string
          current_question: number
          email: string | null
          experience_path: string
          expires_at: string
          id: string
          participant_id: string | null
          phase1_results: Json | null
          token: string
          total_questions: number
          used: boolean
          used_at: string | null
        }
        Insert: {
          answers?: Json
          assessment_id?: string | null
          created_at?: string
          current_question: number
          email?: string | null
          experience_path: string
          expires_at?: string
          id?: string
          participant_id?: string | null
          phase1_results?: Json | null
          token?: string
          total_questions: number
          used?: boolean
          used_at?: string | null
        }
        Update: {
          answers?: Json
          assessment_id?: string | null
          created_at?: string
          current_question?: number
          email?: string | null
          experience_path?: string
          expires_at?: string
          id?: string
          participant_id?: string | null
          phase1_results?: Json | null
          token?: string
          total_questions?: number
          used?: boolean
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_tokens_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "dna_participants"
            referencedColumns: ["id"]
          },
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
