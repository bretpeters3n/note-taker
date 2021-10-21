const express = require("express");
const path = require("path");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// GET Route for notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET Route for retrieving all the notes
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// POST Route for a new note
app.post("/api/notes", (req, res) => {
  if (req.body) {
    const theNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    const thisNote = req.body;
    thisNote.id = uuidv4();
    theNotes.push(thisNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(theNotes));
    return res.json(theNotes);
  } else {
    return res.error("Error in adding note");
  }
});

// GET Route for retrieving all the notes
app.delete("/api/notes/:id", (req, res) => {
  const theNotes = JSON.parse(fs.readFileSync("./db/db.json"));
  const deleteID = req.params.id;
  const notesLeft = theNotes.filter((eachNote) => eachNote.id !== deleteID);
  fs.writeFileSync("./db/db.json", JSON.stringify(notesLeft));
  return res.json(notesLeft);
});

// GET Route for catchALL
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
