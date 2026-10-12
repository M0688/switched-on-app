// Public settings (safe to publish: the anon key only allows what the database rules permit).
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vspyupfdpxmntqyqvlar.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcHl1cGZkcHhtbnRxeXF2bGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDc3MTIsImV4cCI6MjEwNzM4MzcxMn0.CBB5f8LnX9Knx2SbzVOH3rtJLLeW5TLA2DUE9M3XyGw';
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BL90b_GJnw8MLEcpB6xgSYCLst3cKd5k7G2CW0esl-pdo11PJrvlCqJ2Ow2hzhzn2Qys8-IkiZzQjfvFoL7stIk';
