

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { forEach } = require("lodash");

let homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat nulla ipsa laborum quasi iure totam autem veritatis aut, assumenda nesciunt ullam maiores necessitatibus cumque dicta odio saepe? In mollitia fuga rerum explicabo perspiciatis ex vel unde eveniet fugit cupiditate doloribus enim eos quibusdam repellat esse, asperiores ullam iure accusamus itaque recusandae illo animi nisi. Veritatis quasi reiciendis cupiditate dicta aspernatur!";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = []

app.get("/", (req,res)=>{
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
  })


  
})

app.get("/about", (req, res)=>{
  res.render("about", {
    aboutContent: aboutContent
  })
})

app.get("/contact", (req,res)=>{
  res.render("contact", {
    contactContent: contactContent
  })
})

app.get("/compose", (req,res)=>{
  res.render("compose")
})

app.post("/compose", (req,res)=>{
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }
  posts.push(post)
  res.redirect("/")
})









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
