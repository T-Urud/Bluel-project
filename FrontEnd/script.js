const gallery = document.querySelector(".gallery");
let projects = [];
let token = sessionStorage.getItem("authToken");

async function fetchProjects() {
  await fetch("http://localhost:5678/api/works").then((res) =>
    res.json().then((data) => (projects = data))
  );
  console.log(projects);
  projectsDisplay();
  modalGalleryDisplay();
}

function projectsDisplay() {
  for (let i = 0; i < projects.length; i++) {
    gallery.innerHTML += `
      <figure>
        <img src="${projects[i].imageUrl}" alt=${projects[i].title}>
        <figcaption>${projects[i].title}</figcaption>
      </figure>
    `;
  }
}
projectsDisplay(projects);

// ----- BTN -----

const allBtn = document.getElementById("all");
const objectBtn = document.getElementById("object");
const flatBtn = document.getElementById("flats");
const hotelBtn = document.getElementById("hotel&Resto");
const filterBtns = document.querySelectorAll(".filterBtn");

// avoir effet hover qui reste quand on click le btn
filterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    button.classList.add("active");
  });
});

allBtn.addEventListener("click", () => {
  gallery.innerHTML = "";
  projectsDisplay();
});

objectBtn.addEventListener("click", () => {
  const objectsProject = projects.filter((project) => {
    return project.category.id == 1;
  });
  gallery.innerHTML = "";
  for (let i = 0; i < objectsProject.length; i++) {
    gallery.innerHTML += `
      <figure>
        <img src="${objectsProject[i].imageUrl}" alt=${objectsProject[i].title}>
        <figcaption>${objectsProject[i].title}</figcaption>
      </figure>
    `;
  }
});

flatBtn.addEventListener("click", () => {
  const flatsProject = projects.filter((project) => {
    return project.category.id == 2;
  });
  gallery.innerHTML = "";
  for (let i = 0; i < flatsProject.length; i++) {
    gallery.innerHTML += `
      <figure>
        <img src="${flatsProject[i].imageUrl}" alt=${flatsProject[i].title}>
        <figcaption>${flatsProject[i].title}</figcaption>
      </figure>
    `;
  }
});

hotelBtn.addEventListener("click", () => {
  const hotelsProject = projects.filter((project) => {
    return project.category.id == 3;
  });
  gallery.innerHTML = "";
  for (let i = 0; i < hotelsProject.length; i++) {
    gallery.innerHTML += `
      <figure>
        <img src="${hotelsProject[i].imageUrl}" alt=${hotelsProject[i].title}>
        <figcaption>${hotelsProject[i].title}</figcaption>
      </figure>
    `;
  }
});

// ----------------- Log  -----------

const logBtn = document.getElementById("loginBtn");
const editGallery = document.querySelector(".modifLog");

function edit() {
  if (token) {
    logBtn.textContent = "logout";
    logBtn.style.cursor = "pointer";

    document.querySelector(".black").style.visibility = "visible";
    editGallery.style.display = "block";
    document.querySelector(".btnContainer").style.visibility = "hidden";
  }
}
edit();

// ------------- Modal ------------
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

// -------------------------------------------------------

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
      } catch (error) {
        // console.log("error");
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
        console.log("fichier supprimé");
        closeModal();
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

// ---------
let title = "";
let category = "";
let categoryId = "";
let file = null;
let photo = false;

const validBtnChange = () => {
  if (title && photo && category) {
    validBtn.removeAttribute("disabled");
    validBtn.style.cursor = "pointer";
    validBtn.style.background = "#1D6154";
  } else {
    validBtn.setAttribute("disabled", "disabled");
  }
};

const categoryChoice = () => {
  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      validBtnBefore.classList.remove("before-hidden");
      categoryInput.value = option.innerText;
      category = option;

      if (option.innerText == "Objets") {
        categoryId = 1;
      } else if (option.innerText == "Appartements") {
        categoryId = 2;
      } else if (option.innerText == "Hotels & restaurants") {
        categoryId = 3;
      }
      validBtnChange();
    });
  });
};
categoryChoice();

const uploadPhoto = () => {
  fileInput.addEventListener("change", (e) => {
    file = e.target.files[0];

    if (file && file.size > 4194304) {
      alert("Le fichier dépasse 4Mo ");
      e.preventDefault();
      photo = false;
      file = null;
    }

    if (file) {
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
  if (title && category && photo == true) {
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
  closeModal(e);
});

window.addEventListener("load", fetchProjects);
