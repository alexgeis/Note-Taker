const express = require("express");
const path = require("path");
const fs = require("fs");
// const util = require("util");
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
  // console.log(res.json(db));
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    }
  });
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
      id: uuid(),
    };
    readAndAppend(newNote, "./db/db.json");
    return res.json(db);
  } else {
    res.error("Error in adding note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  // Log our request to the terminal
  console.log(`${req.method} request received to get notes`);
  const deleteId = req.params.id;
  console.log(req.params);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      for (var i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id === deleteId) {
          parsedData.splice(i, 1);
          console.log("NEWLY PARSED -----", parsedData);
          writeToFile("./db/db.json", parsedData);
        }
      }
    }
  });
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    }
  });
});

// GET request for wildcard pages
app.get("*", (req, res) => {
  console.info(`${req.method} request received to get wildcard/index page`);
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(process.env.PORT || PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
