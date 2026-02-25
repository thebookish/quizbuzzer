import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const adminEmail = "admin@buzzr.local";
    const adminPassword = "BuzzrAdmin2024!";

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u: any) => u.email === adminEmail);

    if (existing) {
      await supabaseAdmin.auth.admin.updateUserById(existing.id, { password: adminPassword });
      await supabaseAdmin.from("users").upsert({ id: existing.id, email: adminEmail, role: "admin" });
      return new Response(
        JSON.stringify({ success: true, email: adminEmail, password: adminPassword, note: "updated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) throw error;

    await supabaseAdmin.from("users").upsert({
      id: newUser.user!.id,
      email: adminEmail,
      role: "admin",
    });

    return new Response(
      JSON.stringify({ success: true, email: adminEmail, password: adminPassword, note: "created" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
