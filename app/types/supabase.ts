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
      documents: {
        Row: {
          id: string
          created_at: string
          user_id: string
          file_name: string
          file_url: string
          file_type: string
          parsed_data: Json
          status: 'processing' | 'completed' | 'failed'
          verification_status: 'pending' | 'verified' | 'mismatch'
          gemini_result: Json | null
          deepseek_result: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          file_name: string
          file_url: string
          file_type: string
          parsed_data?: Json
          status?: 'processing' | 'completed' | 'failed'
          verification_status?: 'pending' | 'verified' | 'mismatch'
          gemini_result?: Json | null
          deepseek_result?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          parsed_data?: Json
          status?: 'processing' | 'completed' | 'failed'
          verification_status?: 'pending' | 'verified' | 'mismatch'
          gemini_result?: Json | null
          deepseek_result?: Json | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          created_at: string
          notification_preferences: Json
          theme: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          notification_preferences?: Json
          theme?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          notification_preferences?: Json
          theme?: string
        }
      }
    }
  }
}
