const inputs = document.querySelectorAll(
  'input[type="email"], input[type="password"]'
);
const emailInput = document.getElementById("email");
const loginForm = document.querySelector("form");
let email, password;

const validateEmail = (value) => {
  return value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i);
};

const emailChecker = (value) => {
  if (!validateEmail(value)) {
    emailInput.classList.add("error");
    email = null;
  } else {
    email = value;
    emailInput.classList.remove("error");
  }
};

const passwordChecker = (value) => {
  password = value;
  console.log(password);
};

const submitForm = () => {
  if (email && password) {
    const userData = {
      email,
      password,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(userData);
    console.log(chargeUtile);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      .then((res) => {
        if (!res.ok) {
          alert("Erreur");
        } else {
          res.json().then((data) => {
            console.log(data);
            const token = data.token;
            sessionStorage.setItem("authToken", token);
            window.location.href = "index.html";
          });
        }
      })
      .catch(() => {
        alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
      });
  } else {
    alert("Veuillez remplir tous les champs");
  }
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
    }
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm();
});
