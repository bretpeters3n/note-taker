const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
// const api = require("./routes/index.js");
const { v4: uuidv4 } = require("uuid");

// Helper method for generating unique ids
// const uuid = require("./helpers/uuid");

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

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

// GET Route for retrieving all the notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  //   const { username, topic, tip } = req.body;

  if (req.body) {
    //     const newTip = {
    //       username,
    //       tip,
    //       topic,
    //       tip_id: uuid(),
    //     };

    readAndAppend(req.body, "./db/db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding note");
  }
});

// GET Route for retrieving all the notes
app.get("/api/notes/:id", (req, res) => {
  console.info(`${req.params.id} requested delete received for notes`);
  //   readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// GET Route for catchALL
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
