import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? "https://jmmmskjsvjdqeiccpnkf.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) { console.error("Set SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const email = process.argv[2];
const password = process.argv[3];
if (!email || !password) { console.error("Usage: node create-user.mjs <email> <password>"); process.exit(1); }

const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
if (error) { console.error(error); process.exit(1); }
console.log("created:", data.user?.email, data.user?.id);
