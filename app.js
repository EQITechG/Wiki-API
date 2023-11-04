
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB').then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

const articleSchema = new mongoose.Schema({  //Creating the schema/ tables
  title: String,
  content: String
})

const Article = mongoose.model("Article", articleSchema);

const article = new Article ({ //Data Inserted
    title: "Mongoose",
    content: "This is an easier framework to manage MongoDB"
})
// article.save();
// console.log("First Article has been saved")


////////////////REQUEST TARGETING ALL ARTICLES///////

app.route("/articles")

.get(async (req,res)=>{
  
  try{
  const foundArticles = await Article.find({});
  res.json(foundArticles);// or
  // res.send(foundArticles); // This count be used as well
  }catch (err) {
      console.error('Error:', err); // Add this line
      res.status(500).json({ error: err.message });
    }
})
.post(async (req, res)=>{
  // console.log(req.body.title, req.body.content)

  const newArticle = new Article ({ 
    title: req.body.title,
    content: req.body.content
});

try{
  await newArticle.save();
  res.send("Successfully added a new article");
}catch(err){
  res.send(err);
}


})

.delete(async (req,res)=>{
  try{
    await Article.deleteMany({})
    res.send("Successfully deleted all articles");
  }catch (err){
    res.send(err);
  }
 
});
////////////////REQUEST TARGETTING SPECIFIC ARTICLES///////




app.route("/articles/:articleTitle")
.get(async (req,res)=>{
  try{
    const foundTitle = await Article.findOne({title: req.params.articleTitle})
    if(foundTitle){
      res.send(foundTitle);
    }else{
      res.send("No Article match found")
    }
   
  }catch (err){
    res.send(err);
  }
})
.put(async (req,res)=>{
 try{
    await Article.replaceOne(
    {title: req.params.articleTitle},
    {title:req.body.title, content: req.body.content},
    { overwrite: true }
  )
  res.send("Successful")
 }catch (err){
  res.send(err)
 }
})
.patch(async (req,res)=>{
  try{

    await Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body}
    )
    res.send("Successful")
  
  }catch (err){
    res.send(err);
  }
})
.delete(async (req,res)=>{
  try{
    await Article.deleteOne({title: req.params.articleTitle})
    res.send("Successfully deleted all articles");
  }catch (err){
    res.send(err);
  }
 
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,()=>{
console.log("Server Running on Port 3000")
});


// old way (deprecated)

// Model.find(function(err, models){
//   if (err) {
//     console.log(err);
//   }else {
//     console.log(models);
//   }
// });


// // new way

// Model.find()
// .then(function (models) {
//   console.log(models);
// })
// .catch(function (err) {
//   console.log(err);
// });