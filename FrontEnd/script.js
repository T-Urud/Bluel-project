const gallery = document.querySelector(".gallery");
let projects = [];
let token = sessionStorage.getItem("authToken");

async function fetchProjects() {
  await fetch("http://localhost:5678/api/works").then((res) =>
    res.json().then((data) => (projects = data))
  );
  projectsDisplay(projects);

  if (token) {
    modalGalleryDisplay();
  }
}

function projectsDisplay(projectsArray) {
  gallery.innerHTML = "";
  for (let i = 0; i < projectsArray.length; i++) {
    gallery.innerHTML += `
      <figure data-project="${projectsArray[i].id}" data-category="${projectsArray[i].categoryId}">
        <img src="${projectsArray[i].imageUrl}" alt=${projectsArray[i].title}>
        <figcaption>${projectsArray[i].title}</figcaption>
      </figure>
    `;
  }
}

// ----- BTN -----

const allBtn = document.getElementById("all");
const objectBtn = document.getElementById("object");
const flatBtn = document.getElementById("flats");
const hotelBtn = document.getElementById("hotel&Resto");
const filterBtns = document.querySelectorAll(".filterBtn");

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);
    buttonsDisplay(categories);
    categoryChoice(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function buttonsDisplay(categories) {
  const btnContainer = document.querySelector(".btnContainer");
  btnContainer.innerHTML += `
    <button class="filterBtn" id="all">Tous</button>
  `;
  categories.forEach((category) => {
    btnContainer.innerHTML += `
      <button class="filterBtn" id="${category.id}">${category.name}</button>
    `;
  });
  addEventListenersToButtons();
}

function addEventListenersToButtons() {
  const buttons = document.querySelectorAll(".filterBtn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      CategoryClick(button.id);
      // avoir effet hover qui reste quand on click le btn
      document.querySelector(".active")?.classList.remove("active");
      button.classList.add("active");
    });
  });
}

function CategoryClick(categoryId) {
  if (categoryId === "all") {
    projectsDisplay(projects);
  } else {
    const filteredProjects = projects.filter(
      (project) => project.categoryId.toString() === categoryId
    );
    projectsDisplay(filteredProjects);
  }
}
window.onload = () => {
  fetchCategories();
};
// ----------------- LOG  -----------

const logBtn = document.getElementById("loginBtn");
const editGallery = document.querySelector(".modifLog");

function edit() {
  if (token) {
    logBtn.textContent = "logout";
    logBtn.addEventListener("click", () => {
      sessionStorage.removeItem("authToken");
      document.location.reload();
    });

    document.querySelector(".black").style.visibility = "visible";
    editGallery.style.display = "block";
    document.querySelector(".btnContainer").style.visibility = "hidden";
  }
}
edit();

// ------------- MODAL ------------
let modal = null;

const openModal = (e) => {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.visibility = "visible";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  document.querySelector(".closeContainer").style.display = "flex";
  modal.addEventListener("click", closeModal);
  modal.querySelector(".closingIcon").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = (e) => {
  if (modal === null) return;
  if (e) {
    e.preventDefault();
  }
  modal.style.visibility = "hidden";
  document.querySelector(".closeContainer").style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".closingIcon").removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

editGallery.addEventListener("click", openModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// ------------------ AFFICHAGE GALLERY MODAL + DELETE ---------------------------

const modalGalleryDisplay = () => {
  const galleryContainer = document.querySelector(".galleryContainer");
  for (let i = 0; i < projects.length; i++) {
    const projectPhoto = document.createElement("figure");
    projectPhoto.classList.add("projectPhoto");

    const trashContainer = document.createElement("div");
    trashContainer.classList.add("trashContainer");
    trashContainer.innerHTML = `<img src="./assets/icons/trash.svg" alt="trash icon">`;

    const projectImg = document.createElement("img");
    projectImg.src = projects[i].imageUrl;
    projectImg.alt = projects[i].title;

    projectPhoto.appendChild(trashContainer);
    projectPhoto.appendChild(projectImg);

    trashContainer.addEventListener("click", async () => {
      try {
        await deleteProject(projects[i].id);
        projectPhoto.remove();
        document
          .querySelector(`figure[data-project="${projects[i].id}"]`)
          .remove();
      } catch (error) {
        console.error("error");
      }
    });

    galleryContainer.appendChild(projectPhoto);
  }
};
modalGalleryDisplay();

const deleteProject = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      accept: "*/*",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        console.info("fichier supprimé");
      } else {
        alert(`Erreur ${res.status} lors de la tentative`);
      }
    })
    .catch((error) => {
      alert("une erreur s'est produite");
    });
};

// --------- change modal page ---------

modalBtn.addEventListener("click", () => {
  const modalV1 = document.querySelector(".modalV1");
  modalV1.style.display = "none";

  const modalV2 = document.querySelector(".modalV2");
  modalV2.style.display = "block";

  hiddenIcon.style.visibility = "visible";
});

hiddenIcon.addEventListener("click", () => {
  const modalV1 = document.querySelector(".modalV1");
  modalV1.style.display = "block";

  const modalV2 = document.querySelector(".modalV2");
  modalV2.style.display = "none";

  hiddenIcon.style.visibility = "hidden";
});

// dropdown category
const select = document.querySelector(".select");
const caret = document.querySelector(".caret");
const menu = document.querySelector(".menu");
const options = document.querySelectorAll(".menu li");
const selected = document.querySelector(".selected");
const validBtnBefore = document.querySelector(".validBtnContainer");
const categoryInput = document.getElementById("category");

select.addEventListener("click", () => {
  caret.classList.toggle("caret-rotate");
  menu.classList.toggle("menu-open");
  validBtnBefore.classList.toggle("before-hidden");
});

// --------- ADD PROJECT ---------

let title = "";
let categoryId = "";
let file = null;
let photo = false;

const validBtnChange = () => {
  if (title && photo && categoryId) {
    validBtn.removeAttribute("disabled");
    validBtn.style.cursor = "pointer";
    validBtn.style.background = "#1D6154";
  } else {
    validBtn.setAttribute("disabled", "disabled");
  }
};

const categoryChoice = (categories) => {
  categories.forEach((category) => {
    const option = document.createElement("li");
    option.textContent = category.name;
    option.addEventListener("click", () => {
      selected.innerText = category.name;
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      validBtnBefore.classList.remove("before-hidden");
      categoryInput.value = category.name;
      categoryId = category.id;

      validBtnChange();
    });
    menu.appendChild(option);
  });
};
const uploadPhoto = () => {
  const validFormat = ["image/jpeg", "image/png"];
  fileInput.addEventListener("change", (e) => {
    file = e.target.files[0];

    if (file) {
      if (file.size > 4194304) {
        alert("Le fichier dépasse 4Mo ");
        e.preventDefault();
        photo = false;
        file = null;
        return;
      }

      if (!validFormat.includes(file.type)) {
        alert("Le fichier n'est pas une image valide");
        e.preventDefault();
        photo = false;
        file = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
      photo = true;

      addIcon.style.display = "none";
      document.querySelector(".addPhoto").style.display = "none";
      infoFormat.style.display = "none";
      document.querySelector(".addPhotoContainer").style.padding = "0 20px";
      validBtnChange();
    }
  });
};
uploadPhoto();

const titleChecker = (value) => {
  title = value;
  validBtnChange();
};

const inputs = document.querySelectorAll(".js-select");

inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "title":
        titleChecker(e.target.value);
        break;
      case "category":
        categoryChoice(e.target.value);
        break;
    }
  });
});

const addNewWork = (temporaryWork) => {
  const figure = document.createElement("figure");
  figure.id = temporaryWork.id;

  const img = document.createElement("img");
  img.src = temporaryWork.imageUrl;
  img.alt = temporaryWork.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = temporaryWork.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  gallery.appendChild(figure);
};

const submitProjectForm = () => {
  if (title && categoryId && photo == true) {
    const formData = new FormData(addProjectForm);
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          alert("Network response is not ok");
        }
        return res.json();
      })
      .then((temporaryWork) => {
        addNewWork(temporaryWork);
      })
      .catch((error) => {
        console.error("error");
      });
  } else {
    alert("Veuillez remplir tous les champs");
  }
};

addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitProjectForm();
});

window.addEventListener("load", fetchProjects);
