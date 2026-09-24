const SUPABASE_URL =
  "https://qdtjuvtcairdskrppnaa.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_4gCpAyujXlfZ0rsdHkzVzg_VxqpC0qQ";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


const SIGNUP_FUNCTION_URL =
  SUPABASE_URL +
  "/functions/v1/signup-verification";


// ==================================================
// SIGN UP
// ==================================================

async function signUpUser() {

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
  button.textContent = "Sending Code...";


  try {

    const response =
      await fetch(
        SIGNUP_FUNCTION_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            action: "send-code",

            accountType: accountType,

            firstName: firstName,

            lastName: lastName,

            dateOfBirth: dateOfBirth,

            email: email,

            password: password

          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.error ||
        "Unable to send verification code."
      );
    }


    sessionStorage.setItem(
      "pendingSignupEmail",
      email
    );


    window.location.href =
      "verify-email.html";


  } catch (error) {

    console.error(
      "Signup error:",
      error
    );

    message.textContent =
      error.message;

    button.disabled = false;

    button.textContent =
      "Create Account";
  }
}



// ==================================================
// VERIFY SIGNUP CODE
// ==================================================

async function verifySignupCode() {

  const email =
    sessionStorage.getItem(
      "pendingSignupEmail"
    );

  const code =
    document
      .getElementById("verificationCode")
      .value
      .trim();

  const message =
    document.getElementById(
      "verificationMessage"
    );

  const button =
    document.getElementById(
      "verifyButton"
    );


  message.textContent = "";
  message.style.color =
    "#c82333";


  if (!email) {

    message.textContent =
      "Your signup session has expired. Please start again.";

    return;
  }


  if (!/^\d{6}$/.test(code)) {

    message.textContent =
      "Please enter the 6-digit verification code.";

    return;
  }


  button.disabled = true;
  button.textContent =
    "Verifying...";


  try {

    const response =
      await fetch(
        SIGNUP_FUNCTION_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            action: "verify-code",

            email: email,

            code: code

          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.error ||
        "Unable to verify your email."
      );
    }


    sessionStorage.removeItem(
      "pendingSignupEmail"
    );


    message.style.color =
      "#137333";

    message.textContent =
      "Email verified. Your account has been created.";


    setTimeout(function () {

      window.location.href =
        "login.html";

    }, 1000);


  } catch (error) {

    console.error(
      "Verification error:",
      error
    );

    message.style.color =
      "#c82333";

    message.textContent =
      error.message;

    button.disabled = false;

    button.textContent =
      "Verify Email";
  }
}



// ==================================================
// RESEND VERIFICATION CODE
// ==================================================

async function resendSignupCode() {

  const email =
    sessionStorage.getItem(
      "pendingSignupEmail"
    );

  const message =
    document.getElementById(
      "verificationMessage"
    );

  const button =
    document.getElementById(
      "resendButton"
    );


  if (!email) {

    message.textContent =
      "Your signup session has expired. Please start again.";

    return;
  }


  button.disabled = true;
  button.textContent =
    "Sending...";


  try {

    const response =
      await fetch(
        SIGNUP_FUNCTION_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            action: "resend-code",

            email: email

          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.error ||
        "Unable to resend the code."
      );
    }


    message.style.color =
      "#137333";

    message.textContent =
      "A new verification code has been sent.";


  } catch (error) {

    message.style.color =
      "#c82333";

    message.textContent =
      error.message;


  } finally {

    button.disabled = false;

    button.textContent =
      "Resend Code";
  }
}



// ==================================================
// DISPLAY EMAIL ON VERIFICATION PAGE
// ==================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const email =
      sessionStorage.getItem(
        "pendingSignupEmail"
      );

    const emailElement =
      document.getElementById(
        "verificationEmail"
      );


    if (
      emailElement &&
      email
    ) {

      emailElement.textContent =
        email;
    }

  }
);



// ==================================================
// SIGN IN
// ==================================================

async function signInUser() {

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  const message =
    document.getElementById(
      "loginMessage"
    );


  message.textContent = "";

  message.style.color =
    "#c82333";


  if (!email || !password) {

    message.textContent =
      "Please enter your email and password.";

    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient.auth
      .signInWithPassword({

        email: email,

        password: password

      });


  if (error) {

    message.textContent =
      "Invalid email or password.";

    return;
  }


  if (data.session) {

    window.location.href =
      "dashboard.html";
  }
}



// ==================================================
// CHECK AUTHENTICATION
// ==================================================

async function requireAuth() {

  const {
    data: {
      user
    }
  } =
    await supabaseClient.auth.getUser();


  if (!user) {

    window.location.href =
      "login.html";

    return null;
  }


  return user;
}



// ==================================================
// LOG OUT
// ==================================================

async function logoutUser() {

  const {
    error
  } =
    await supabaseClient.auth.signOut();


  if (error) {

    alert(error.message);

    return;
  }


  window.location.href =
    "login.html";
}



// ==================================================
// LOAD USER INFORMATION
// ==================================================

async function loadUserInformation() {

  const user =
    await requireAuth();


  if (!user) return;


  const firstName =
    user.user_metadata?.first_name ||
    "";

  const lastName =
    user.user_metadata?.last_name ||
    "";

  const accountType =
    user.user_metadata?.account_type ||
    "";

  const dateOfBirth =
    user.user_metadata?.date_of_birth ||
    "";


  const nameElement =
    document.getElementById(
      "userName"
    );

  const emailElement =
    document.getElementById(
      "userEmail"
    );

  const accountTypeElement =
    document.getElementById(
      "accountType"
    );

  const dateOfBirthElement =
    document.getElementById(
      "dateOfBirth"
    );


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