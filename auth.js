const SUPABASE_URL =
  "https://qdtjuvtcairdskrppnaa.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_4gCpAyujXlfZ0rsdHkzVzg_VxqpC0qQ";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


// ==========================================
// SIGN UP
// ==========================================

async function signUpUser() {
  alert("Signup function is working!");

  const accountType =
    document.getElementById("accountType").value;

  const firstName =
    document.getElementById("firstName").value.trim();

  const lastName =
    document.getElementById("lastName").value.trim();

  const dateOfBirth =
    document.getElementById("dateOfBirth").value;

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const message =
    document.getElementById("signupMessage");

  const button =
    document.getElementById("signupButton");


  message.textContent = "";
  message.style.color = "#c82333";


  if (
    !accountType ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    message.textContent =
      "Please complete all fields.";
    return;
  }


  if (password.length < 8) {
    message.textContent =
      "Password must be at least 8 characters.";
    return;
  }


  if (password !== confirmPassword) {
    message.textContent =
      "Passwords do not match.";
    return;
  }


  button.disabled = true;
  button.textContent = "Creating Account...";


  try {

    const { data, error } =
      await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

          data: {
            account_type: accountType,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth
          },
          emailRedirectTo:

            window.location.origin + "/login.html"

        }

      });


    if (error) {
      throw error;
    }


    /*
      Supabase has created the Auth user
      and sent the confirmation email.
    */


    message.style.color = "#137333";

    message.textContent =
      "Account created. Check your email and click the confirmation link to verify your account.";

    button.disabled = false;

    button.textContent = "Create Account";

  } catch (error) {

    console.error("Signup error:", error);

    button.disabled = false;
    button.textContent = "Create Account";

    message.style.color = "#c82333";

    message.textContent =
      error.message || "Unable to create account.";
  }
}


// ==========================================
// SIGN IN
// ==========================================

async function signInUser() {

  const email =
    document.getElementById("loginEmail")
      .value
      .trim();

  const password =
    document.getElementById("loginPassword")
      .value;

  const message =
    document.getElementById("loginMessage");


  message.textContent = "";
  message.style.color = "#c82333";


  if (!email || !password) {

    message.textContent =
      "Please enter your email and password.";

    return;
  }


  const { data, error } =
    await supabaseClient.auth.signInWithPassword({

      email: email,

      password: password

    });


  if (error) {

    if (
      error.message
        .toLowerCase()
        .includes("email not confirmed")
    ) {

      sessionStorage.setItem(
        "signupEmail",
        email
      );

      message.textContent =
        "Please verify your email before signing in.";

      return;
    }


    message.textContent =
      "Invalid email or password.";

    return;
  }


  if (data.session) {

    window.location.href =
      "dashboard.html";
  }
}


// ==========================================
// CHECK AUTHENTICATION
// ==========================================

async function requireAuth() {

  const {
    data: { user }
  } =
    await supabaseClient.auth.getUser();


  if (!user) {

    window.location.href =
      "login.html";

    return null;
  }


  return user;
}


// ==========================================
// LOG OUT
// ==========================================

async function logoutUser() {

  const { error } =
    await supabaseClient.auth.signOut();


  if (error) {

    alert(error.message);

    return;
  }


  window.location.href =
    "login.html";
}


// ==========================================
// LOAD USER INFORMATION
// ==========================================

async function loadUserInformation() {

  const user =
    await requireAuth();


  if (!user) return;


  const firstName =
    user.user_metadata?.first_name || "";

  const lastName =
    user.user_metadata?.last_name || "";

  const accountType =
    user.user_metadata?.account_type || "";

  const dateOfBirth =
    user.user_metadata?.date_of_birth || "";


  const nameElement =
    document.getElementById("userName");

  const emailElement =
    document.getElementById("userEmail");

  const accountTypeElement =
    document.getElementById("accountType");

  const dateOfBirthElement =
    document.getElementById("dateOfBirth");


  if (nameElement) {

    nameElement.textContent =
      `${firstName} ${lastName}`.trim() ||
      "Customer";
  }


  if (emailElement) {

    emailElement.textContent =
      user.email || "";
  }


  if (accountTypeElement) {

    accountTypeElement.textContent =
      accountType ||
      "Not specified";
  }


  if (dateOfBirthElement) {

    dateOfBirthElement.textContent =
      dateOfBirth ||
      "Not specified";
  }
}