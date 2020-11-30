const express=require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")
const app=express();
app.use(express.static("public"));
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
  id:String,
});
const Service = mongoose.model('Service', serviceSchema);


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
})

app.listen(4000,function(){
  console.log("We are live on port 4000");
})
