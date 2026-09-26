const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("user_id", 400c6ca5-d46f-4c1b-8f4e-9518a6e494a4)
    .single();

  if (!error && data) {
    document.getElementById("accountType").textContent =
      data.account_type;
  }
}