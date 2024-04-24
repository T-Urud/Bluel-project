const inputs = document.querySelectorAll(
  'input[type="email"], input[type="password"]'
);
const emailInput = document.getElementById("email");
const loginBtn = document.getElementById("loginBtn");
let email, password;

const emailChecker = (value) => {
  if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
    console.log("email faux");
    emailInput.classList.add("error");
    email = null;
  } else {
    email = value;
    emailInput.classList.remove("error");
    console.log(email);
  }
};

const passwordChecker = (value) => {
  password = value;
  console.log(password);
};

inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "email":
        emailChecker(e.target.value);
        break;
      case "password":
        passwordChecker(e.target.value);
        break;
      default:
        nul;
    }
  });
});

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
});
