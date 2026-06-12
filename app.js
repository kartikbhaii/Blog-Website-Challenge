require("dotenv").config();
const dns = require("dns")
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
    console.warn("⚠️ DNS configuration warning: could not set custom DNS servers.", error.message);
}

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

if (!process.env.MONGODB_URL) {
  console.error("❌ Error: MONGODB_URL environment variable is not defined!");
} else {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to MongoDB successfully.");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post", postSchema)


const app = express();

app.set("views", path.join(__dirname, "views"));
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
    console.error("Error fetching posts:", err);
    res.status(500).send("Internal Server Error: Could not fetch posts.");
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

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  if (mongoose.Types.ObjectId.isValid(requestedPostId)) {
    Post.findOne({ _id: requestedPostId })
      .then((post) => {
        if (!post) {
          return res.status(404).send("Post not found.");
        }
        res.render("post", {
          title: post.title,
          content: post.content
        });
      })
      .catch((err) => {
        console.error("Error finding post by ID:", err);
        res.status(500).send("Internal Server Error");
      });
  } else {
    // Fallback: search by title matching
    const requestedTitle = _.lowerCase(requestedPostId);
    Post.find({})
      .then((posts) => {
        const foundPost = posts.find(post => _.lowerCase(post.title) === requestedTitle);
        if (foundPost) {
          res.render("post", {
            title: foundPost.title,
            content: foundPost.content
          });
        } else {
          res.status(404).send("Post not found.");
        }
      })
      .catch((err) => {
        console.error("Error finding post by title:", err);
        res.status(500).send("Internal Server Error");
      });
  }
});

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
    console.error("Error saving post:", err);
    res.status(500).send("Internal Server Error: Could not save post.");
  });
});


// Note: Handled by consolidated /posts/:postId route above.









const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, function () {
    console.log(`Server started on port ${port}`);
  });
}

module.exports = app;
