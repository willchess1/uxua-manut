import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://hojhvyinstbrweeggfoe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvamh2eWluc3RicndlZWdnZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMzkwNzQsImV4cCI6MjA5MjgxNTA3NH0.mbAlIW0po10GYl09jCOwoCuLZlcm8AK-6_Rh0xNKPUA'
)