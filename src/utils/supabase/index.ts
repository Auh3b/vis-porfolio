import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ProjectSchema {
  id: number;
  created_at: string;
  name: string;
  view_type: 'external' | 'image' | 'internal';
  description: string | null;
  tags: string | null;
  client: string | 'demo';
  github_url: string | null;
}

interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectSchema;
      };
    };
  };
}

const supabase = createClient<Database, 'public'>(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
