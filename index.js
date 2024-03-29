const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const URI =
  "mongodb+srv://Gulhuseyn:19992001@cluster0.ve8uq.mongodb.net/shongarDB?retryWrites=true&w=majority";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const serviceSchema = new mongoose.Schema({
  title: String,
  content: String,
  large: String,
  subContent: Array,
  listContent: Array,
  type: String,
  source: String,
  id: String,
});
const countSchema = new mongoose.Schema({
  view: Number,
  name: String,
});
const clientSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  phone: Number,
  text: String,
  radio: String,
});
const portofolioSchema = new mongoose.Schema({
  source: String,
  title: String,
  content: String,
});

const Service = mongoose.model("Service", serviceSchema);
const Client = mongoose.model("Client", clientSchema);
const Portofolio = mongoose.model("Portofolio", portofolioSchema);
const Count = mongoose.model("Count", countSchema);

// const date = new Date();
// let dayOfWeek = date.getDay();
// let month = date.getMonth() + 1;
// let day = date.getDate();
// console.log(day, month, dayOfWeek);

app.get("/", async function (req, res) {
  var foundItems = [];
  await Service.find(function (err, items) {
    items.forEach((item, i) => {
      foundItems.push(item);
    });
    res.render("index", { Items: foundItems });
  });
  await Count.findOne(
    { _id: "603cab612b814c12581edb85" },
    function (err, foundCount) {
      if (foundCount) {
        let old = foundCount.view;
        foundCount.view = old + 1;
        foundCount.save();
      } else if (err) {
        console.log(err);
      } else {
        console.log("not found");
      }
    }
  );
});

app.get("/admin-login-dashboard", async function (req, res) {
  var foundClients = [];
  var total = 0;
  await Client.find(function (err, clients) {
    clients.forEach((client, i) => {
      foundClients.push(client);
    });
  });
  await Count.findOne(
    { _id: "603cab612b814c12581edb85" },
    function (err, foundCount) {
      if (foundCount) {
        total = foundCount.view;
      } else if (err) {
        console.log(err);
      } else {
        console.log("not found");
      }
    }
  );
  res.render("dashboard", { total: total, Clients: foundClients.reverse() });
});
app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.post("/contact", function (req, res) {
  const { fName, lName, email, phone, text, radio } = req.body;
  const post = new Client({
    name: fName,
    surname: lName,
    email: email,
    phone: phone,
    text: text,
    radio: radio,
  });
  post.save();
  res.redirect("/");
});

app.get("/portofolio", function (req, res) {
  var foundJobs = [];
  Portofolio.find(function (err, jobs) {
    jobs.forEach((job, i) => {
      foundJobs.push(job);
    });
    res.render("portofolio", { Jobs: foundJobs });
  });
});

app.get("/portofolio/:title", function (req, res) {
  const requestedTitle = req.params.title;
  Portofolio.findOne({ title: requestedTitle }, function (err, foundTitle) {
    if (foundTitle) {
      res.render("job", {
        title: foundTitle.title,
        content: foundTitle.content,
        source: foundTitle.source,
      });
    } else if (err) {
      console.log(err);
    }
  });
});

app.get("/services/:cardId", function (req, res) {
  const cardId = req.params.cardId;
  Service.findOne({ _id: cardId }, function (err, foundCard) {
    if (foundCard) {
      res.render("individual-card", {
        title: foundCard.title,
        content: foundCard.content,
        subContent: foundCard.subContent,
        listContent: foundCard.listContent,
        source: foundCard.source,
        large: foundCard.large,
      });
    } else if (err) {
      console.log(err);
    } else {
      console.log("not found");
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("We are live on port 4000");
});
