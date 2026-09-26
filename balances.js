async function loadBalances() {

  const user = await requireAuth();

  if (!user) return;

  const { data, error } = await supabaseClient
    .from("account_balances")
    .select(
      "checking_balance, savings_balance, investment_balance"
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Balance error:", error);
    return;
  }

  document.getElementById("checkingBalance").textContent =
    `$${Number(data.checking_balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("savingsBalance").textContent =
    `$${Number(data.savings_balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

  document.getElementById("investmentBalance").textContent =
    `$${Number(data.investment_balance).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
}

loadBalances();