export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activity_events: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          detail: string | null;
          display_name: string | null;
          id: string;
          item_slug: string | null;
          kind: string;
          title: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          detail?: string | null;
          display_name?: string | null;
          id?: string;
          item_slug?: string | null;
          kind: string;
          title: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          detail?: string | null;
          display_name?: string | null;
          id?: string;
          item_slug?: string | null;
          kind?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_chat_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          role: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_chat_usage: {
        Row: {
          last_message_at: string | null;
          message_count: number;
          usage_date: string;
          user_id: string;
        };
        Insert: {
          last_message_at?: string | null;
          message_count?: number;
          usage_date?: string;
          user_id: string;
        };
        Update: {
          last_message_at?: string | null;
          message_count?: number;
          usage_date?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_meal_plans: {
        Row: {
          created_at: string;
          days: Json;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          days?: Json;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          days?: Json;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      body_measurements: {
        Row: {
          arms_cm: number | null;
          body_fat_pct: number | null;
          chest_cm: number | null;
          created_at: string;
          id: string;
          measured_on: string;
          notes: string | null;
          thighs_cm: number | null;
          user_id: string;
          waist_cm: number | null;
          weight_kg: number | null;
        };
        Insert: {
          arms_cm?: number | null;
          body_fat_pct?: number | null;
          chest_cm?: number | null;
          created_at?: string;
          id?: string;
          measured_on?: string;
          notes?: string | null;
          thighs_cm?: number | null;
          user_id: string;
          waist_cm?: number | null;
          weight_kg?: number | null;
        };
        Update: {
          arms_cm?: number | null;
          body_fat_pct?: number | null;
          chest_cm?: number | null;
          created_at?: string;
          id?: string;
          measured_on?: string;
          notes?: string | null;
          thighs_cm?: number | null;
          user_id?: string;
          waist_cm?: number | null;
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      challenge_participants: {
        Row: {
          avatar_url: string | null;
          challenge_slug: string;
          completed_at: string | null;
          display_name: string | null;
          joined_at: string;
          progress: number;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          challenge_slug: string;
          completed_at?: string | null;
          display_name?: string | null;
          joined_at?: string;
          progress?: number;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          challenge_slug?: string;
          completed_at?: string | null;
          display_name?: string | null;
          joined_at?: string;
          progress?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      challenge_rewards: {
        Row: {
          applies_to: string;
          challenge_slug: string;
          code: string;
          code_kind: string;
          created_at: string;
          discount_percent: number;
          environment: string;
          id: string;
          redeemed_at: string | null;
          redeemed_by_user_id: string | null;
          redeemed_for_slug: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          applies_to?: string;
          challenge_slug: string;
          code: string;
          code_kind?: string;
          created_at?: string;
          discount_percent: number;
          environment?: string;
          id?: string;
          redeemed_at?: string | null;
          redeemed_by_user_id?: string | null;
          redeemed_for_slug?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          applies_to?: string;
          challenge_slug?: string;
          code?: string;
          code_kind?: string;
          created_at?: string;
          discount_percent?: number;
          environment?: string;
          id?: string;
          redeemed_at?: string | null;
          redeemed_by_user_id?: string | null;
          redeemed_for_slug?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_members: {
        Row: {
          joined_at: string;
          last_read_at: string;
          role: string;
          room_id: string;
          user_id: string;
        };
        Insert: {
          joined_at?: string;
          last_read_at?: string;
          role?: string;
          room_id: string;
          user_id: string;
        };
        Update: {
          joined_at?: string;
          last_read_at?: string;
          role?: string;
          room_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_members_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          attachment: Json | null;
          body: string | null;
          created_at: string;
          deleted_at: string | null;
          edited_at: string | null;
          id: string;
          image_path: string | null;
          room_id: string;
          sender_id: string;
        };
        Insert: {
          attachment?: Json | null;
          body?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          edited_at?: string | null;
          id?: string;
          image_path?: string | null;
          room_id: string;
          sender_id: string;
        };
        Update: {
          attachment?: Json | null;
          body?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          edited_at?: string | null;
          id?: string;
          image_path?: string | null;
          room_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_reactions: {
        Row: {
          created_at: string;
          emoji: string;
          message_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          message_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          message_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_reactions_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "chat_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_rooms: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          created_by: string;
          id: string;
          kind: string;
          name: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          kind: string;
          name?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          kind?: string;
          name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      custom_foods: {
        Row: {
          carbs_g_per_100g: number;
          created_at: string;
          fat_g_per_100g: number;
          id: string;
          kcal_per_100g: number;
          name: string;
          protein_g_per_100g: number;
          serving_size_g: number | null;
          user_id: string;
        };
        Insert: {
          carbs_g_per_100g?: number;
          created_at?: string;
          fat_g_per_100g?: number;
          id?: string;
          kcal_per_100g: number;
          name: string;
          protein_g_per_100g?: number;
          serving_size_g?: number | null;
          user_id: string;
        };
        Update: {
          carbs_g_per_100g?: number;
          created_at?: string;
          fat_g_per_100g?: number;
          id?: string;
          kcal_per_100g?: number;
          name?: string;
          protein_g_per_100g?: number;
          serving_size_g?: number | null;
          user_id?: string;
        };
        Relationships: [];
      };
      custom_programs: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
          weeks: Json;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id: string;
          weeks?: Json;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
          weeks?: Json;
        };
        Relationships: [];
      };
      daily_notes: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          note_date: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          note_date: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          note_date?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      email_send_log: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          message_id: string | null;
          metadata: Json | null;
          recipient_email: string;
          status: string;
          template_name: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          metadata?: Json | null;
          recipient_email: string;
          status: string;
          template_name: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          metadata?: Json | null;
          recipient_email?: string;
          status?: string;
          template_name?: string;
        };
        Relationships: [];
      };
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number;
          batch_size: number;
          id: number;
          retry_after_until: string | null;
          send_delay_ms: number;
          transactional_email_ttl_minutes: number;
          updated_at: string;
        };
        Insert: {
          auth_email_ttl_minutes?: number;
          batch_size?: number;
          id?: number;
          retry_after_until?: string | null;
          send_delay_ms?: number;
          transactional_email_ttl_minutes?: number;
          updated_at?: string;
        };
        Update: {
          auth_email_ttl_minutes?: number;
          batch_size?: number;
          id?: number;
          retry_after_until?: string | null;
          send_delay_ms?: number;
          transactional_email_ttl_minutes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_unsubscribe_tokens: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          token: string;
          used_at: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          token: string;
          used_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          token?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      fasting_plans: {
        Row: {
          active: boolean;
          created_at: string;
          eat_hours: number;
          end_time: string;
          fast_hours: number;
          id: string;
          plan_key: string;
          reminders_enabled: boolean;
          start_time: string;
          updated_at: string;
          user_id: string;
          weekly_days: number[];
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          eat_hours?: number;
          end_time?: string;
          fast_hours?: number;
          id?: string;
          plan_key?: string;
          reminders_enabled?: boolean;
          start_time?: string;
          updated_at?: string;
          user_id: string;
          weekly_days?: number[];
        };
        Update: {
          active?: boolean;
          created_at?: string;
          eat_hours?: number;
          end_time?: string;
          fast_hours?: number;
          id?: string;
          plan_key?: string;
          reminders_enabled?: boolean;
          start_time?: string;
          updated_at?: string;
          user_id?: string;
          weekly_days?: number[];
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          item_slug: string;
          item_type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          item_slug: string;
          item_type: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          item_slug?: string;
          item_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      food_log_drafts: {
        Row: {
          carbs_g: number;
          created_at: string;
          fat_g: number;
          grams: number | null;
          id: string;
          kcal: number;
          logged_date: string;
          meal_slot: string;
          name: string;
          protein_g: number;
          servings: number | null;
          source: string | null;
          source_ref: string | null;
          user_id: string;
        };
        Insert: {
          carbs_g?: number;
          created_at?: string;
          fat_g?: number;
          grams?: number | null;
          id?: string;
          kcal?: number;
          logged_date?: string;
          meal_slot?: string;
          name: string;
          protein_g?: number;
          servings?: number | null;
          source?: string | null;
          source_ref?: string | null;
          user_id: string;
        };
        Update: {
          carbs_g?: number;
          created_at?: string;
          fat_g?: number;
          grams?: number | null;
          id?: string;
          kcal?: number;
          logged_date?: string;
          meal_slot?: string;
          name?: string;
          protein_g?: number;
          servings?: number | null;
          source?: string | null;
          source_ref?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      food_log_entries: {
        Row: {
          carbs_g: number;
          created_at: string;
          fat_g: number;
          food_id: string | null;
          food_kind: string | null;
          grams: number | null;
          id: string;
          kcal: number;
          logged_date: string;
          meal_slot: string;
          name: string;
          protein_g: number;
          servings: number | null;
          source: string | null;
          source_ref: string | null;
          user_id: string;
        };
        Insert: {
          carbs_g?: number;
          created_at?: string;
          fat_g?: number;
          food_id?: string | null;
          food_kind?: string | null;
          grams?: number | null;
          id?: string;
          kcal?: number;
          logged_date?: string;
          meal_slot?: string;
          name: string;
          protein_g?: number;
          servings?: number | null;
          source?: string | null;
          source_ref?: string | null;
          user_id: string;
        };
        Update: {
          carbs_g?: number;
          created_at?: string;
          fat_g?: number;
          food_id?: string | null;
          food_kind?: string | null;
          grams?: number | null;
          id?: string;
          kcal?: number;
          logged_date?: string;
          meal_slot?: string;
          name?: string;
          protein_g?: number;
          servings?: number | null;
          source?: string | null;
          source_ref?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      foods: {
        Row: {
          brand: string | null;
          carbs_g_per_100g: number;
          category: string | null;
          created_at: string;
          fat_g_per_100g: number;
          id: string;
          kcal_per_100g: number;
          name: string;
          name_es: string | null;
          name_no: string | null;
          name_pt: string | null;
          protein_g_per_100g: number;
          serving_label: string | null;
          serving_size_g: number | null;
          source: string | null;
        };
        Insert: {
          brand?: string | null;
          carbs_g_per_100g?: number;
          category?: string | null;
          created_at?: string;
          fat_g_per_100g?: number;
          id?: string;
          kcal_per_100g: number;
          name: string;
          name_es?: string | null;
          name_no?: string | null;
          name_pt?: string | null;
          protein_g_per_100g?: number;
          serving_label?: string | null;
          serving_size_g?: number | null;
          source?: string | null;
        };
        Update: {
          brand?: string | null;
          carbs_g_per_100g?: number;
          category?: string | null;
          created_at?: string;
          fat_g_per_100g?: number;
          id?: string;
          kcal_per_100g?: number;
          name?: string;
          name_es?: string | null;
          name_no?: string | null;
          name_pt?: string | null;
          protein_g_per_100g?: number;
          serving_label?: string | null;
          serving_size_g?: number | null;
          source?: string | null;
        };
        Relationships: [];
      };
      image_overrides: {
        Row: {
          image_url: string;
          slot_key: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          image_url: string;
          slot_key: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          image_url?: string;
          slot_key?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      invite_codes: {
        Row: {
          code: string;
          created_at: string;
          environment: string;
          id: string;
          owner_user_id: string;
          redeemed_at: string | null;
          redeemed_by_user_id: string | null;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          environment?: string;
          id?: string;
          owner_user_id: string;
          redeemed_at?: string | null;
          redeemed_by_user_id?: string | null;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          environment?: string;
          id?: string;
          owner_user_id?: string;
          redeemed_at?: string | null;
          redeemed_by_user_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      nutrition_targets: {
        Row: {
          carbs_g: number | null;
          fat_g: number | null;
          kcal: number | null;
          protein_g: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          carbs_g?: number | null;
          fat_g?: number | null;
          kcal?: number | null;
          protein_g?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          carbs_g?: number | null;
          fat_g?: number | null;
          kcal?: number | null;
          protein_g?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      nutrition_targets_daily: {
        Row: {
          carbs_g: number | null;
          created_at: string;
          fat_g: number | null;
          id: string;
          kcal: number | null;
          protein_g: number | null;
          target_date: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          carbs_g?: number | null;
          created_at?: string;
          fat_g?: number | null;
          id?: string;
          kcal?: number | null;
          protein_g?: number | null;
          target_date: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          carbs_g?: number | null;
          created_at?: string;
          fat_g?: number | null;
          id?: string;
          kcal?: number | null;
          protein_g?: number | null;
          target_date?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          active_session_at: string | null;
          active_session_id: string | null;
          avatar_url: string | null;
          country: string | null;
          created_at: string;
          display_name: string | null;
          hidden_plan_slugs: string[] | null;
          hidden_program_slugs: string[] | null;
          id: string;
          preferred_language: string | null;
          training_goal: string | null;
          updated_at: string;
        };
        Insert: {
          active_session_at?: string | null;
          active_session_id?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          display_name?: string | null;
          hidden_plan_slugs?: string[] | null;
          hidden_program_slugs?: string[] | null;
          id: string;
          preferred_language?: string | null;
          training_goal?: string | null;
          updated_at?: string;
        };
        Update: {
          active_session_at?: string | null;
          active_session_id?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          display_name?: string | null;
          hidden_plan_slugs?: string[] | null;
          hidden_program_slugs?: string[] | null;
          id?: string;
          preferred_language?: string | null;
          training_goal?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_progress: {
        Row: {
          completed_days: string[];
          current_week: number;
          last_active_at: string;
          program_slug: string;
          started_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_days?: string[];
          current_week?: number;
          last_active_at?: string;
          program_slug: string;
          started_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_days?: string[];
          current_week?: number;
          last_active_at?: string;
          program_slug?: string;
          started_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          amount_cents: number | null;
          created_at: string;
          currency: string | null;
          environment: string;
          id: string;
          product_kind: string;
          product_slug: string;
          product_title: string | null;
          transaction_id: string | null;
          user_id: string;
        };
        Insert: {
          amount_cents?: number | null;
          created_at?: string;
          currency?: string | null;
          environment?: string;
          id?: string;
          product_kind: string;
          product_slug: string;
          product_title?: string | null;
          transaction_id?: string | null;
          user_id: string;
        };
        Update: {
          amount_cents?: number | null;
          created_at?: string;
          currency?: string | null;
          environment?: string;
          id?: string;
          product_kind?: string;
          product_slug?: string;
          product_title?: string | null;
          transaction_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth: string | null;
          created_at: string;
          endpoint: string;
          id: string;
          p256dh: string | null;
          platform: string;
          streak_reminders_enabled: boolean;
          timezone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          auth?: string | null;
          created_at?: string;
          endpoint: string;
          id?: string;
          p256dh?: string | null;
          platform?: string;
          streak_reminders_enabled?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          auth?: string | null;
          created_at?: string;
          endpoint?: string;
          id?: string;
          p256dh?: string | null;
          platform?: string;
          streak_reminders_enabled?: boolean;
          timezone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          product_kind: string;
          product_slug: string;
          rating: number;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          product_kind?: string;
          product_slug: string;
          rating: number;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          product_kind?: string;
          product_slug?: string;
          rating?: number;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          environment: string;
          id: string;
          price_id: string | null;
          product_id: string | null;
          status: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          environment?: string;
          id?: string;
          price_id?: string | null;
          product_id?: string | null;
          status?: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          environment?: string;
          id?: string;
          price_id?: string | null;
          product_id?: string | null;
          status?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      suppressed_emails: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          metadata: Json | null;
          reason: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          metadata?: Json | null;
          reason: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          metadata?: Json | null;
          reason?: string;
        };
        Relationships: [];
      };
      user_device_challenges: {
        Row: {
          attempts: number;
          code_hash: string;
          created_at: string;
          device_hash: string;
          expires_at: string;
          label: string | null;
          user_id: string;
        };
        Insert: {
          attempts?: number;
          code_hash: string;
          created_at?: string;
          device_hash: string;
          expires_at: string;
          label?: string | null;
          user_id: string;
        };
        Update: {
          attempts?: number;
          code_hash?: string;
          created_at?: string;
          device_hash?: string;
          expires_at?: string;
          label?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_trusted_devices: {
        Row: {
          device_hash: string;
          first_seen_at: string;
          label: string | null;
          last_seen_at: string;
          user_id: string;
        };
        Insert: {
          device_hash: string;
          first_seen_at?: string;
          label?: string | null;
          last_seen_at?: string;
          user_id: string;
        };
        Update: {
          device_hash?: string;
          first_seen_at?: string;
          label?: string | null;
          last_seen_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_ai_coach_slot:
        | {
            Args: {
              _daily_limit: number;
              _throttle_seconds: number;
              _user_id: string;
            };
            Returns: {
              new_count: number;
              ok: boolean;
              reason: string;
              seconds_until_ok: number;
            }[];
          }
        | {
            Args: {
              _daily_limit: number;
              _throttle_seconds: number;
              _timezone?: string;
              _user_id: string;
            };
            Returns: {
              new_count: number;
              ok: boolean;
              reason: string;
              seconds_until_ok: number;
            }[];
          };
      delete_email: {
        Args: { message_id: number; queue_name: string };
        Returns: boolean;
      };
      email_queue_dispatch: { Args: never; Returns: undefined };
      enqueue_email: {
        Args: { payload: Json; queue_name: string };
        Returns: number;
      };
      get_activity_feed: {
        Args: { feed_limit?: number };
        Returns: {
          avatar_url: string;
          created_at: string;
          detail: string;
          display_name: string;
          id: string;
          item_slug: string;
          kind: string;
          title: string;
        }[];
      };
      get_challenge_leaderboard: {
        Args: { lim?: number; slug: string };
        Returns: {
          avatar_url: string;
          completed_at: string;
          display_name: string;
          joined_at: string;
          progress: number;
          user_id: string;
        }[];
      };
      get_challenge_participant_count: {
        Args: { slug: string };
        Returns: number;
      };
      get_my_streak: {
        Args: { days_back?: number };
        Returns: {
          current_streak: number;
          days_this_week: number;
          last_logged_date: string;
          longest_streak: number;
        }[];
      };
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string };
        Returns: boolean;
      };
      is_room_member: {
        Args: { _room_id: string; _user_id: string };
        Returns: boolean;
      };
      is_room_owner: {
        Args: { _room_id: string; _user_id: string };
        Returns: boolean;
      };
      move_to_dlq: {
        Args: {
          dlq_name: string;
          message_id: number;
          payload: Json;
          source_queue: string;
        };
        Returns: number;
      };
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number };
        Returns: {
          message: Json;
          msg_id: number;
          read_ct: number;
        }[];
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
