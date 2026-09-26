const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("user_id", user.id)
    .single();

  if (!error && data) {
    document.getElementById("accountType").textContent =
      data.account_type;
  }
}