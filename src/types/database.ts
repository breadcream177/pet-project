export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          memo: string | null;
          name: string;
          species: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          id?: string;
          memo?: string | null;
          name: string;
          species: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          memo?: string | null;
          name?: string;
          species?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      schedules: {
        Row: {
          category: Database["public"]["Enums"]["schedule_category"];
          created_at: string;
          day_of_week: number | null;
          id: string;
          is_active: boolean;
          pet_id: string;
          repeat_rule: Database["public"]["Enums"]["repeat_rule"];
          start_date: string;
          time: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["schedule_category"];
          created_at?: string;
          day_of_week?: number | null;
          id?: string;
          is_active?: boolean;
          pet_id: string;
          repeat_rule: Database["public"]["Enums"]["repeat_rule"];
          start_date: string;
          time: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["schedule_category"];
          created_at?: string;
          day_of_week?: number | null;
          id?: string;
          is_active?: boolean;
          pet_id?: string;
          repeat_rule?: Database["public"]["Enums"]["repeat_rule"];
          start_date?: string;
          time?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      schedule_completions: {
        Row: {
          completed_at: string;
          completed_date: string;
          id: string;
          schedule_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          completed_date: string;
          id?: string;
          schedule_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          completed_date?: string;
          id?: string;
          schedule_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth_key: string;
          created_at: string;
          endpoint: string;
          expiration_time: string | null;
          id: string;
          p256dh_key: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auth_key: string;
          created_at?: string;
          endpoint: string;
          expiration_time?: string | null;
          id?: string;
          p256dh_key: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auth_key?: string;
          created_at?: string;
          endpoint?: string;
          expiration_time?: string | null;
          id?: string;
          p256dh_key?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      device_tokens: {
        Row: {
          created_at: string;
          device_label: string | null;
          id: string;
          last_seen_at: string;
          platform: "android" | "ios" | "web";
          token: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          device_label?: string | null;
          id?: string;
          last_seen_at?: string;
          platform: "android" | "ios" | "web";
          token: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          device_label?: string | null;
          id?: string;
          last_seen_at?: string;
          platform?: "android" | "ios" | "web";
          token?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          created_at: string;
          enabled: boolean;
          minutes_before: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          minutes_before?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          enabled?: boolean;
          minutes_before?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      repeat_rule: "none" | "daily" | "weekly";
      schedule_category: "meal" | "walk" | "medicine" | "hospital" | "care";
    };
    CompositeTypes: Record<string, never>;
  };
};
