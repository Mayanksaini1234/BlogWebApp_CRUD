// SQL
// INSERT INTO blog (title , date , content , author)
// VALUES ('AI', '2024-03-03','Artificial','maaynk');
// id is serial 

import Express from "express";
import bodyParser from "body-parser";
import axios from "axios";

import pg from "pg";
const app = Express();
const port = 3000;
const api_url = "http://localhost:4000";

app.use(Express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Ms1234$#",
  port: 5432,
});
db.connect();

// get all posts

app.get("/", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM blog");
    // console.log(response.rows);
    res.render("index1.ejs", { post: response.rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// get webpage for new post
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New post", submit: "Create post" });
});

// show only single web page as we click on post
app.get("/posting/:id", async (req, res) => {
  try {
    const response = await axios.get(api_url + "/posts/" + req.params.id);
    res.render("index2.ejs", { post: response.data });
  } catch (error) {}
});

// get page for edit post
app.get(`/edit/:id`, async (req, res) => {
  try {
    // only for ejs file recurring for showing data for editing
    const response = await axios.get(api_url + "/posts/" + req.params.id);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Submit changes",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "error edit blog" });
  }
});

// new post  logic
app.post("/api/posts", async (req, res) => {
  const new_title = req.body.title;
  const new_content = req.body.content;
  const new_author = req.body.author;
  const date = new Date();

  try {
    await db.query(
      "INSERT INTO blog (title,date,content,author) VALUES ($1,$2,$3,$4)",
      [new_title, date, new_content, new_author]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error posting Blog" });
  }
});


//  edit post  logic
app.post("/api/posts/:id", async (req, res) => {
  try {
    const edit_title = req.body.title;
    const edit_content = req.body.content;
    const edit_author = req.body.author;
    const edit_id = req.params.id;
    await db.query(
      "UPDATE blog SET title = $1, content = $2, author = $3 WHERE id= $4 ",
      [edit_title, edit_content, edit_author, edit_id]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "error edit post" });
  }
});

//  delete post api logic
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    const delete_id = req.params.id;
    console.log(delete_id);
    await db.query("DELETE FROM blog WHERE id = $1", [delete_id]);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`port ${port} is active!!`);
});
