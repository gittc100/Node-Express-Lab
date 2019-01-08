// import your node modules

const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json()); // teaches express how to parse json from the body

// add your server code starting here

server.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

server.get("/api/posts/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

server.post("/api/posts", (req, res) => {
  const postInfo = req.body;
  console.log(req.body);
  if (!postInfo.title || !postInfo.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(postInfo)
      .then(resultId => {
        console.log(resultId);
        db.findById(resultId.id)
          .then(post => {
            console.log(post);
            res.status(201).json(post);
          })
          .catch(() =>
            res
              .status(500)
              .json({ error: "The post information could not be retrieved." })
          );
      })
      .catch(() => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

server.delete("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        db.remove(id).then(() => {
          res.status(200).json(post);
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

server.put("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  const postChanges = req.body;

  if (!postChanges.title || !postChanges.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  else {
    
    db.findById(id).then(post => {
      if (post.length > 0) {
        db.update(id, postChanges)
          .then(result => {
            res.status(200).json(result);
          })
          .catch(() => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      } 
      else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    });
  
  
  
  
  
  }
});

server.listen(5001, () => console.log("server running"));


// try {
    //   const result = await db.update(id, postChanges);
    //   console.log("result", result);
    //   res.status(200).json(result);
    // } catch (err) {
    //   res
    //     .status(500)
    //     .json({ error: "The post information could not be modified." });
    // }