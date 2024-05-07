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
  modal.addEventListener("click", closeModal);
  modal.querySelector(".closingIcon").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = (e) => {
  if (modal === null) return;
  e.preventDefault();
  modal.style.visibility = "hidden";
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
        console.log("tst");
      } catch (error) {
        console.log("error");
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
      } else {
        alert(`Erreur ${res.status} lors de la tentative`);
      }
    })
    .catch((error) => {
      alert("une erreur s'est produite");
    });
};

console.log(token);

window.addEventListener("load", fetchProjects);
