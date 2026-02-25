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
    const { teamCode, password } = await req.json();

    if (!teamCode || !password) {
      return new Response(
        JSON.stringify({ error: "teamCode and password are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Use service key to create/update auth user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const teamEmail = `${teamCode.toLowerCase()}@team.buzzr.local`;

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u: any) => u.email === teamEmail);

    if (existingUser) {
      // Update password
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );
      if (updateErr) throw updateErr;
      return new Response(
        JSON.stringify({ success: true, userId: existingUser.id, updated: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Create new user
    const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: teamEmail,
      password,
      email_confirm: true,
    });

    if (createErr) throw createErr;

    // Upsert into public.users
    await supabaseAdmin.from("users").upsert({
      id: newUser.user!.id,
      email: teamEmail,
      role: "team",
      team_code: teamCode.toUpperCase(),
    });

    return new Response(
      JSON.stringify({ success: true, userId: newUser.user!.id, created: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
