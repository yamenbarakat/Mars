let store = Immutable.Map({
  author: Immutable.Map({ name: "Yamen" }),
  apod: "",
  rovers: Immutable.List(["curiosity", "opportunity", "spirit"]),
});

const roversData = {};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Immutable.merge(store, newState);
  return store;
};

const render = async (root, store) => {
  root.innerHTML = App(store.toJS());
};

// create content
const App = (store) => {
  let { rovers, apod, author } = store;

  return `
        <header><h1>Mars Rovers</h1></header>
        <main>
            <section>
                <h2>Planetary Image, Date: ${apod.image.date}</h2>
                ${ImageOfTheDay(apod)}
            </section>
            <section id="rovers">
                <h2>Choose the rover you want to view</h2>
                ${addTabs(createTabs)}
                <div id="rover"></div>
            </section>
        </main>
        <footer>All rights reserved, made by ${author.name}</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  getImageOfTheDay(store);
  getAllRovers();
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);

  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" id="planetary-img"/>
            <p>${apod.image.explanation}</p>
        `;
  }
};

// create li element for each rover
const createTabs = () => {
  const rovers = store.toJS().rovers;
  return rovers.map(
    (rover) => `<li onclick="callBackClick(this)">${rover}</li>`
  );
};

// higher order function returns the tabs to be added to the DOM
const addTabs = (tabs) => {
  return `<ul id='tabs'>
         ${tabs().reduce((acc, current) => acc + current)}
         </ul>`;
};

// a function to run on click event for each tab
const callBackClick = (tab) => {
  showRover(tab.textContent, updateDomRover);
};

// get all rovers
const getAllRovers = () => {
  store.toJS().rovers.forEach((roverName) => {
    getRover(roverName);
  });
};

// store rovers data
const storeRoversData = (roverName, data) => {
  roversData[roverName] = updateRover(data);
};

// get the needed info from each rover
const updateRover = (data) => {
  const rover = data.latest_photos[0];
  return {
    earth_date: rover.earth_date,
    img_src: rover.img_src,
    name: rover.rover.name,
    status: rover.rover.status,
    landing_date: rover.rover.landing_date,
    launch_date: rover.rover.launch_date,
  };
};

// higher order function that shows the rover data in the DOM
const showRover = (roverName, updateRover) => {
  const roverElement = document.getElementById("rover");
  roverElement.innerHTML = updateRover(roverName);
};

// update the rover element to the data of the clicked rover tab
const updateDomRover = (roverName) => {
  const roverObj = roversData[roverName];
  return `<img src="${roverObj.img_src}" alt="${roverObj.name} rover image">
          <div id="rover-data">
            <h3>${roverObj.name} info</h3>
            <ul>
              <li>earth date: ${roverObj.earth_date}</li>
              <li>landing date: ${roverObj.landing_date}</li>
              <li>launch date: ${roverObj.launch_date}</li>
              <li>status: ${roverObj.status}</li>
            </ul>
          </div>`;
};

// ------------------------------------------------------  API CALLS

// get the latest image
const getImageOfTheDay = (state) => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(state, { apod }))
    .then((store) => {
      render(root, store);
      return store;
    });
};

// get rover
const getRover = (roverName) => {
  fetch(`http://localhost:3000/${roverName}`)
    .then((res) => res.json())
    .then((rover) => {
      storeRoversData(roverName, rover);
      return rover;
    });
};
