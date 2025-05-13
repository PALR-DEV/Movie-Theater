import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mrsrpfrlyryrjiryumrc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc3JwZnJseXJ5cmppcnl1bXJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTEwMzkwNiwiZXhwIjoyMDU2Njc5OTA2fQ.k1cnrMUznEh95aHuM0tmZfojtpsDjBz-YBFM7YM_Zso"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)