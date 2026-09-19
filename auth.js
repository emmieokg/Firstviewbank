const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ================================
// SIGN UP
// ================================

async function signUpUser() {

  const accountType = document.getElementById("accountType").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const homeAddress = document.getElementById("homeAddress").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const message = document.getElementById("signupMessage");

  message.textContent = "";
  message.style.color = "#c82333";


  // Check required fields
  if (
    !accountType ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !homeAddress ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    message.textContent = "Please complete all fields.";
    return;
  }


  // Password length
  if (password.length < 8) {
    message.textContent =
      "Password must be at least 8 characters.";
    return;
  }


  // Password confirmation
  if (password !== confirmPassword) {
    message.textContent =
      "Passwords do not match.";
    return;
  }


  // Create account
  const { data, error } = await supabaseClient.auth.signUp({

    email: email,

    password: password,

    options: {

      data: {
        account_type: accountType,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        home_address: homeAddress
      },

      emailRedirectTo:
        window.location.origin + "/login.html"
    }
  });


  // Error
  if (error) {
    message.textContent = error.message;
    return;
  }


  // Success
  message.style.color = "#137333";


  // If email confirmation is disabled
  if (data.session) {

    window.location.href = "dashboard.html";

  } else {

    message.textContent =
      "Account created. Please check your email to verify your account.";
  }
}



// ================================
// SIGN IN
// ================================

async function signInUser() {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

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

    message.textContent =
      "Invalid email or password.";

    return;
  }


  if (data.session) {

    window.location.href = "dashboard.html";

  }
}



// ================================
// CHECK AUTHENTICATION
// ================================

async function requireAuth() {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();


  if (!user) {

    window.location.href = "login.html";

    return null;
  }


  return user;
}



// ================================
// LOG OUT
// ================================

async function logoutUser() {

  const { error } =
    await supabaseClient.auth.signOut();


  if (error) {

    alert(error.message);

    return;
  }


  window.location.href = "login.html";
}



// ================================
// SHOW USER INFORMATION
// ================================

async function loadUserInformation() {

  const user = await requireAuth();

  if (!user) return;


  const firstName =
    user.user_metadata?.first_name || "";

  const lastName =
    user.user_metadata?.last_name || "";

  const accountType =
    user.user_metadata?.account_type || "";

  const dateOfBirth =
    user.user_metadata?.date_of_birth || "";

  const homeAddress =
    user.user_metadata?.home_address || "";


  const nameElement =
    document.getElementById("userName");

  const emailElement =
    document.getElementById("userEmail");

  const accountTypeElement =
    document.getElementById("accountType");

  const dateOfBirthElement =
    document.getElementById("dateOfBirth");

  const addressElement =
    document.getElementById("homeAddress");


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
      accountType || "Not specified";
  }


  if (dateOfBirthElement) {

    dateOfBirthElement.textContent =
      dateOfBirth || "Not specified";
  }


  if (addressElement) {

    addressElement.textContent =
      homeAddress || "Not specified";
  }
}