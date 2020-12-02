const express=require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")
const app=express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/shongarDB', { useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


const serviceSchema = new mongoose.Schema({
  title:String,
  content:String,
  url:String,
  type:String,
  id:String
});
const clientSchema= new mongoose.Schema({
  name:String,
  surname:String,
  email:String,
  phone:Number,
  text:String,
  radio:String
});
const portofolioSchema= new mongoose.Schema({
source:String,
title:String,
content:String
});

const Service = mongoose.model('Service', serviceSchema);
const Client = mongoose.model('Client',clientSchema);
const Portofolio =mongoose.model('Portofolio',portofolioSchema);

app.get("/",function(req,res){
  var foundItems=[]
  Service.find(function(err,items){
    items.forEach((item, i) => {
      foundItems.push(item);
    });
      res.render("index",{Items:foundItems});
  });
});

app.get("/about",function(req,res){
  res.render("about")
});

app.get("/contact",function(req,res){
  res.render("contact")
});

app.post("/contact",function(req,res){
  const {fName,lName,email,phone,text,radio}=req.body;
  const post = new Client({
    name:fName,
    surname:lName,
    email:email,
    phone:phone,
    text:text,
    radio:radio

  });
  post.save();
  res.redirect("/")
});

app.get("/portofolio",function(req,res){
  var foundJobs=[];
  Portofolio.find(function(err,jobs){
    jobs.forEach((job, i) => {
      foundJobs.push(job);
    });
    res.render("portofolio",{Jobs:foundJobs});
  })
});

app.get("/:title",function(req,res){
  const requestedTitle=req.params.title;
  Portofolio.findOne({title:requestedTitle},function(err,foundTitle){
    if (foundTitle) {
      res.render("job",{title:foundTitle.title,content:foundTitle.content,source:foundTitle.source});
    }else if (err) {
      console.log(err);
    }
  })
});
app.listen(4000,function(){
  console.log("We are live on port 4000");
})
