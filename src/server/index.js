require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// API calls

// get the latest image
app.get("/apod", async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log("error:", err);
  }
});

// get curiosity rover
app.get("/curiosity", async (req, res) => {
  try {
    const curiosity = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(curiosity);
  } catch (err) {
    console.log("error:", err);
  }
});

// get oportunity Rover
app.get("/opportunity", async (req, res) => {
  try {
    const opportunity = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(opportunity);
  } catch (err) {
    console.log("error:", err);
  }
});

// get spirit rover
app.get("/spirit", async (req, res) => {
  try {
    const spirit = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send(spirit);
  } catch (err) {
    console.log("error:", err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
