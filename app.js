require("dotenv").config();
const dns = require("dns")
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
    console.warn("⚠️ DNS configuration warning: could not set custom DNS servers.", error.message);
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL)
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


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", (req, res) => {
  Post.find({})
  .then((posts) => {
    res.render("home", {
      posts: posts
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
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









const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
