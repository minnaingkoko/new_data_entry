const express = require("express");
const app = express();
const path = require("path");
const  { print }  = require('pdf-to-printer');
const { PDFDocument } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/smartcard-form", (req, res) => {
  res.render("smartcard-form");
});

app.get("/visa-form", (req, res) => {
  res.render("visa-form");
});

app.post("/smartcard-form", async (req, res) => {

  const pdfDoc = await PDFDocument.load(
    readFileSync(
      path.resolve(path.join(__dirname, "InputData"), "smartCardForm.pdf")
    )
  );

  const date = new Date(smData.birthday);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

    const form = pdfDoc.getForm();

    // const fieldNames = form.getFields().map((f) => f.getName());
    // console.log({ fieldNames });

    form.getTextField('Name').setText(smData.name);
    form.getTextField("FatherName").setText(smData.fatherName);
    form.getTextField("BirthDay").setText(day.toString());
    form.getTextField("BirthMonth").setText(month.toString());
    form.getTextField("BirthYear").setText(year.toString());
    form.getTextField("BirthPlace").setText(smData.birthPlace);
    form.getTextField("Relegion").setText(smData.relegion);
    // form.getRadioGroup("Gender").select(smData.gender);
    // form.getCheckBox("FactoryWorker").check();
    form.getTextField("PassportNo").setText(smData.passportNo);
    // form.getTextField("WorkingCountry").setText("မလေးရှား");
    form.getTextField("wCompanyName").setText(smData.wCompanyName);
    form.getTextField("wCompanyAddress").setText(smData.wCompanyAddress);
    form.getTextField("fAgencyName").setText(smData.fAgencyName);
    // form.getTextField("lAgencyName").setText(smData.lAgencyName);
    form.getTextField("phNo").setText(smData.phNo);


    const pdfBytes = await pdfDoc.save();
    writeFileSync(path.join(__dirname, "OutputData", "output.pdf"), pdfBytes);

  const options = {
    side : "duplex",
  };
  await print("OutputData/output.pdf", options).then(console.log);
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
