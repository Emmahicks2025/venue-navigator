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
      events: {
        Row: {
          away_team: string | null
          category: string
          created_at: string
          date: string
          description: string | null
          group_name: string | null
          home_team: string | null
          id: string
          is_featured: boolean
          match_number: number | null
          max_price: number
          min_price: number
          name: string
          performer: string
          performer_image: string | null
          round: string | null
          source: string | null
          svg_map_name: string | null
          ticket_url: string | null
          time: string
          updated_at: string
          venue_city: string
          venue_name: string
          venue_state: string | null
        }
        Insert: {
          away_team?: string | null
          category?: string
          created_at?: string
          date: string
          description?: string | null
          group_name?: string | null
          home_team?: string | null
          id?: string
          is_featured?: boolean
          match_number?: number | null
          max_price?: number
          min_price?: number
          name: string
          performer: string
          performer_image?: string | null
          round?: string | null
          source?: string | null
          svg_map_name?: string | null
          ticket_url?: string | null
          time?: string
          updated_at?: string
          venue_city?: string
          venue_name: string
          venue_state?: string | null
        }
        Update: {
          away_team?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          group_name?: string | null
          home_team?: string | null
          id?: string
          is_featured?: boolean
          match_number?: number | null
          max_price?: number
          min_price?: number
          name?: string
          performer?: string
          performer_image?: string | null
          round?: string | null
          source?: string | null
          svg_map_name?: string | null
          ticket_url?: string | null
          time?: string
          updated_at?: string
          venue_city?: string
          venue_name?: string
          venue_state?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_email: string | null
          billing_first_name: string | null
          billing_last_name: string | null
          billing_zip: string | null
          created_at: string
          id: string
          order_number: string
          service_fee: number
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_email?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_zip?: string | null
          created_at?: string
          id?: string
          order_number: string
          service_fee?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_email?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_zip?: string | null
          created_at?: string
          id?: string
          order_number?: string
          service_fee?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performer_images: {
        Row: {
          created_at: string
          id: string
          image_height: number | null
          image_url: string
          image_width: number | null
          performer_name: string
          source: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_height?: number | null
          image_url: string
          image_width?: number | null
          performer_name: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_height?: number | null
          image_url?: string
          image_width?: number | null
          performer_name?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_transfers: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          message: string | null
          status: string
          ticket_id: string
          to_email: string
          to_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          message?: string | null
          status?: string
          ticket_id: string
          to_email: string
          to_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string | null
          status?: string
          ticket_id?: string
          to_email?: string
          to_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_transfers_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          barcode: string
          created_at: string
          event_date: string
          event_id: string
          event_name: string
          event_time: string
          id: string
          order_id: string
          performer: string | null
          performer_image: string | null
          price: number
          remarks: string | null
          row_name: string
          seat_number: number
          section_name: string
          status: string
          updated_at: string
          user_id: string
          venue_name: string
        }
        Insert: {
          barcode?: string
          created_at?: string
          event_date: string
          event_id: string
          event_name: string
          event_time?: string
          id?: string
          order_id: string
          performer?: string | null
          performer_image?: string | null
          price?: number
          remarks?: string | null
          row_name: string
          seat_number: number
          section_name: string
          status?: string
          updated_at?: string
          user_id: string
          venue_name: string
        }
        Update: {
          barcode?: string
          created_at?: string
          event_date?: string
          event_id?: string
          event_name?: string
          event_time?: string
          id?: string
          order_id?: string
          performer?: string | null
          performer_image?: string | null
          price?: number
          remarks?: string | null
          row_name?: string
          seat_number?: number
          section_name?: string
          status?: string
          updated_at?: string
          user_id?: string
          venue_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venue_maps: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          svg_content: string
          updated_at: string
          venue_city: string | null
          venue_country: string | null
          venue_name: string
          venue_state: string | null
          venue_type: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          svg_content: string
          updated_at?: string
          venue_city?: string | null
          venue_country?: string | null
          venue_name: string
          venue_state?: string | null
          venue_type?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          svg_content?: string
          updated_at?: string
          venue_city?: string | null
          venue_country?: string | null
          venue_name?: string
          venue_state?: string | null
          venue_type?: string | null
        }
        Relationships: []
      }
      world_cup_events: {
        Row: {
          available_tickets: number | null
          away_team: string | null
          created_at: string
          event_date: string
          event_time: string | null
          group_name: string | null
          home_team: string | null
          id: string
          image_url: string | null
          match_type: string | null
          max_price: number | null
          min_price: number | null
          name: string
          status: string | null
          ticketmaster_id: string
          ticketmaster_url: string | null
          updated_at: string
          venue_city: string
          venue_country: string | null
          venue_lat: number | null
          venue_lon: number | null
          venue_name: string
          venue_state: string | null
        }
        Insert: {
          available_tickets?: number | null
          away_team?: string | null
          created_at?: string
          event_date: string
          event_time?: string | null
          group_name?: string | null
          home_team?: string | null
          id?: string
          image_url?: string | null
          match_type?: string | null
          max_price?: number | null
          min_price?: number | null
          name: string
          status?: string | null
          ticketmaster_id: string
          ticketmaster_url?: string | null
          updated_at?: string
          venue_city: string
          venue_country?: string | null
          venue_lat?: number | null
          venue_lon?: number | null
          venue_name: string
          venue_state?: string | null
        }
        Update: {
          available_tickets?: number | null
          away_team?: string | null
          created_at?: string
          event_date?: string
          event_time?: string | null
          group_name?: string | null
          home_team?: string | null
          id?: string
          image_url?: string | null
          match_type?: string | null
          max_price?: number | null
          min_price?: number | null
          name?: string
          status?: string | null
          ticketmaster_id?: string
          ticketmaster_url?: string | null
          updated_at?: string
          venue_city?: string
          venue_country?: string | null
          venue_lat?: number | null
          venue_lon?: number | null
          venue_name?: string
          venue_state?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
