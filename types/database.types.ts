export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: { key: string; value: string };
        Insert: { key: string; value?: string };
        Update: { key?: string; value?: string };
        Relationships: [];
      };
      document_categories: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
          created_at: string;
          headline: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order?: number;
          created_at?: string;
          headline?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
          headline?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          storage_path: string;
          download_url: string | null;
          thumbnail_url: string | null;
          file_name: string | null;
          file_size: number | null;
          file_type: string | null;
          category: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
          hero_description: string | null;
          overview_heading: string | null;
          hero_highlight_1: string | null;
          hero_highlight_2: string | null;
          hero_highlight_3: string | null;
          hero_highlights_extra: string | null;
          hero_image_1_url: string | null;
          hero_image_2_url: string | null;
          hero_image_3_url: string | null;
          hero_image_4_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          storage_path: string;
          download_url?: string | null;
          thumbnail_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          category?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          hero_description?: string | null;
          overview_heading?: string | null;
          hero_highlight_1?: string | null;
          hero_highlight_2?: string | null;
          hero_highlight_3?: string | null;
          hero_highlights_extra?: string | null;
          hero_image_1_url?: string | null;
          hero_image_2_url?: string | null;
          hero_image_3_url?: string | null;
          hero_image_4_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          storage_path?: string;
          download_url?: string | null;
          thumbnail_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          file_type?: string | null;
          category?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          hero_description?: string | null;
          overview_heading?: string | null;
          hero_highlight_1?: string | null;
          hero_highlight_2?: string | null;
          hero_highlight_3?: string | null;
          hero_highlights_extra?: string | null;
          hero_image_1_url?: string | null;
          hero_image_2_url?: string | null;
          hero_image_3_url?: string | null;
          hero_image_4_url?: string | null;
        };
        Relationships: [];
      };
      email_templates: {
        Row: {
          id: string;
          subject: string;
          body_html: string;
          is_published: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject: string;
          body_html: string;
          is_published?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject?: string;
          body_html?: string;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      template_document_links: {
        Row: {
          id: string;
          template_id: string;
          document_id: string;
          label: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          template_id: string;
          document_id: string;
          label: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          template_id?: string;
          document_id?: string;
          label?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      download_form_configs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          template_id: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          template_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          template_id?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      download_requests: {
        Row: {
          id: string;
          name: string;
          last_name: string | null;
          first_name: string | null;
          email: string;
          company: string;
          department: string;
          phone: string;
          request_purpose: string | null;
          questions: string;
          privacy_consent: boolean;
          requested_at: string;
          workflow_status: string;
          email_status: EmailStatus;
          template_id: string | null;
          document_id: string | null;
          requested_document_title: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          last_name?: string | null;
          first_name?: string | null;
          email: string;
          company?: string;
          department?: string;
          phone?: string;
          request_purpose?: string | null;
          questions?: string;
          privacy_consent?: boolean;
          requested_at: string;
          workflow_status?: string;
          email_status?: EmailStatus;
          template_id?: string | null;
          document_id?: string | null;
          requested_document_title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          last_name?: string | null;
          first_name?: string | null;
          email?: string;
          company?: string;
          department?: string;
          phone?: string;
          request_purpose?: string | null;
          questions?: string;
          privacy_consent?: boolean;
          requested_at?: string;
          workflow_status?: string;
          email_status?: EmailStatus;
          template_id?: string | null;
          document_id?: string | null;
          requested_document_title?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      download_request_documents: {
        Row: {
          request_id: string;
          document_id: string;
          sort_order: number;
        };
        Insert: {
          request_id: string;
          document_id: string;
          sort_order?: number;
        };
        Update: {
          request_id?: string;
          document_id?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      download_counts_by_document: {
        Args: { p_since: string | null };
        Returns: {
          document_id: string;
          download_count: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
