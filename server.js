const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const PORT = 3001;
const db = require("./db/db.json");
const uuid = require("./helpers/uuid");
const app = express();

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get("/", (req, res) => {
  console.info(`${req.method} request received to get wildcard/index page`);
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET request for notes page
app.get("/notes", (req, res) => {
  console.info(`${req.method} request received to get notes page`);
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// GET request for API notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to get notes db`);
  console.log(res.json(db));
  // fs.readFile("./db/db.json", "utf8", (err, data) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     const parsedData = JSON.parse(data);
  //     res.json(parsedData);
  //   }
  // });
});

app.post("/api/notes", (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} request received to post notes`);
  // Sending database object to the client
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };
    readAndAppend(newNote, "./db/db.json");
    return res.json(db);
  } else {
    res.error("Error in adding note");
  }
  // return res.json(db);
});

app.delete("/api/notes:id", (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

// POST request to add a review
app.post("/api/reviews", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Prepare a response object to send back to the client
  let response;

  // Check if there is anything in the response body
  if (req.body && req.body.product) {
    response = {
      status: "success",
      data: req.body,
    };
    res.json(`Review for ${response.data.product} has been added!`);
  } else {
    res.json("Request body must at least contain a product name");
  }

  // Log the response body to the console
  console.log(req.body);

  //read file first, convert to javascript array of objects, add new object to array of objects, then write file
});

// GET request for wildcard pages
app.get("*", (req, res) => {
  console.info(`${req.method} request received to get wildcard/index page`);
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
