const express = require("express");

const PORT = 3001;
const db = require("./db/db.json");

const app = express();

// Middleware for parsing application/json and urlencoded data
app.use(express.static("public"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// GET request for ALL reviews
app.get("/api/notes", (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);

  // Sending database object to the client
  return res.json(db);
});
app.delete("/api/notes:id", (req, res) => {
  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);

  // Sending database object to the client
  //   return res.json(db);
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

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
