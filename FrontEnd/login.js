const inputs = document.querySelectorAll(
  'input[type="email"], input[type="password"]'
);
const emailInput = document.getElementById("email");
const loginForm = document.querySelector("form");
let email, password;

const emailChecker = (value) => {
  if (!value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)) {
    emailInput.classList.add("error");
    email = null;
  } else {
    email = value;
    emailInput.classList.remove("error");
    // console.log(email);
  }
};

const passwordChecker = (value) => {
  password = value;
  // console.log(password);
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

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (email && password) {
    const idData = {
      email,
      password,
    };
    console.log(idData);

    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(idData);
    console.log(chargeUtile);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    }).then((res) => {
      if (res.status !== 200) {
        console.log("erreur");
      } else {
        res.json();
      }
    });
    // .then(data => {
    //   const token = data.token;
    //   console.log(token);
    // });

    inputs.forEach((input) => (input.value = ""));
    email = null;
    password = null;
  } else {
    alert("Veuillez remplir correctement les champs");
  }
});
