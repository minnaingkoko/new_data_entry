const PizZip = require("pizzip");
const express = require("express");
const app = express();
const path = require("path");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// configure express to use EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Render the data entry form using EJS
app.get("/", (req, res) => {
  res.render("form");
});

app.post("/submit-form", (req, res) => {
  // Read the template Word document
  const content = fs.readFileSync(
    path.resolve(path.join(__dirname, "/InputData"), "Document.docx"),
    "binary"
  );

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Set the data for the placeholders
  doc.render({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
  });

  // Generate the modified Word document
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // Save the modified Word document on the server
  fs.writeFileSync(
    path.resolve(path.join(__dirname, "OutputData"), "output.docx"),
    buf
  );

  // Send the modified Word document to the user
  // res.download(path.resolve(__dirname, "output.docx"));
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
