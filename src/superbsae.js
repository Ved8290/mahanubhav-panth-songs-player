
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djasafplbfhidnvqrqda.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYXNhZnBsYmZoaWRudnFycWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjkyMjIsImV4cCI6MjA2NjI0NTIyMn0.QcHCunqJBLXSbOx33oGgVU-Sa80SYw5x_-tuM3gquHs'
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;