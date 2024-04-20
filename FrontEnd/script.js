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
  }
}
projectsDisplay();

// const projectsData = await fetch("http://localhost:5678/api/works");
// const project = await projectsData.json();

// function projectsDisplay(project) {
//   for (let i = 0; i < project.length; i++) {
//     figureElement = document.createElement("figure");
//     figureElement.innerHTML = `<img src="${project[i].imageUrl}" alt=${project[i].title}> <figcaption>${project[i].title}</figcaption>`;
//     gallery.appendChild(figureElement);
//   }
// }
// projectsDisplay(project);

// ----- BTN -----

const allBtn = document.getElementById("all");
const objectBtn = document.getElementById("object");
const flatBtn = document.getElementById("flats");
const hotelBtn = document.getElementById("hotel&Resto");

objectBtn.addEventListener("click", () => {
  const ex = projects[5].id;
  console.log(ex);
  const objectsProject = projects.filter((project) => {
    return (project.category.id = 1);
  });

  console.log(objectsProject);
  gallery.innerHTML = "";
  projectsDisplay(objectsProject);
});

window.addEventListener("load", fetchProjects);
