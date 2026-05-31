const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://kk:kkhannu0@cluster0.piqnmt9.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema)

let homeStartingContent =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat nulla ipsa laborum quasi iure totam autem veritatis aut, assumenda nesciunt ullam maiores necessitatibus cumque dicta odio saepe? In mollitia fuga rerum explicabo perspiciatis ex vel unde eveniet fugit cupiditate doloribus enim eos quibusdam repellat esse, asperiores ullam iure accusamus itaque recusandae illo animi nisi. Veritatis quasi reiciendis cupiditate dicta aspernatur!";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  Post.find({})
  .then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postId", (req, res)=>{
const requestedPostId = req.params.postId;
Post.findOne({ _id: requestedPostId })
  .then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
  .catch((err) => {
    console.log(err);
  });



})

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  })
  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/");
  });
});


app.get("/posts/:postName", (req,res)=>{
  const requestedTitle = _.lowerCase(req.params.postName)
  posts.forEach(post => {
    const storedTitle = _.lowerCase(post.title)
    if (requestedTitle === storedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      })
    }
  });
})









app.listen(3000, function () {
  console.log("Server started on port 3000");
});
