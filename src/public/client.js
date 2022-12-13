let store = Immutable.Map({
  author: Immutable.Map({ name: "Yamen" }),
  apod: "",
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
});

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
            <section
                <h3>Planetary Image, Date: ${apod.image.date}</h3>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer>All rights reserved, made by ${author.name}</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  getImageOfTheDay(store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

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
            <img src="${apod.image.url}" height="300px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
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
const getRover = (state) => {
  let { apod } = state;

  fetch(`http://localhost:3000/curiosity`)
    .then((res) => res.json())
    .then((apod) => {
      console.log(apod);
    });

  return;
};
