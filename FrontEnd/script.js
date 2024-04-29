const gallery = document.querySelector(".gallery");
let projects = [];

async function fetchProjects() {
  await fetch("http://localhost:5678/api/works").then((res) =>
    res.json().then((data) => (projects = data))
  );
  console.log(projects);
  projectsDisplay();
}

function projectsDisplay() {
  for (let i = 0; i < projects.length; i++) {
    gallery.innerHTML += `
      <figure>
        <img src="${projects[i].imageUrl}" alt=${projects[i].title}>
        <figcaption>${projects[i].title}</figcaption>
      </figure>
    `;
    // const project = projects[i];
    // const projectElement = document.createElement("figure");
    // projectElement.dataset.id = projects[i].id;
    // const imgElement = document.createElement("img");
    // imgElement.src = project.imageUrl;
    // const captionElement = document.createElement("figcaption");
    // captionElement.innerText = project.title;

    // gallery.appendChild(projectElement);
    // projectElement.appendChild(imgElement);
    // projectElement.appendChild(captionElement);
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
let token = sessionStorage.getItem("authToken");

console.log(token);

window.addEventListener("load", fetchProjects);
