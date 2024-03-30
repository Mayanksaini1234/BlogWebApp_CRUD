// axios.get(url[, config])
// axios.delete(url[, config])
// axios.post(url[, data[, config]])
// axios.put(url[, data[, config]])
// axios.patch(url[, data[, config]])


import  Express  from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = Express();
const port = 3000;
const api_url = "http://localhost:4000"
app.use(Express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
// get all posts
app.get("/", async(req,res)=>{
    try {
        const response = await axios.get(`${api_url}/posts`)
        // console.log(response.data)
     res.render("index1.ejs", {post:response.data})
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
      }
    });

    // get webpage for new post 

    app.get("/new", (req,res)=>{
        res.render("modify.ejs", {heading: "New post" , submit: "Create post" })
    })

    // get page for edit post
    
    app.get(`/edit/:id`,async (req,res)=>{
       
        try{
            // only for ejs file recurring for showing data for editing
            const response = await axios.get(api_url+"/posts/"+req.params.id)
            res.render("modify.ejs" , { heading:"Edit Post" , submit:"Submit changes" , post: response.data  
        })
   
        }
        catch(error){
res.status(500).json({message:"error edit blog"})
        }
    })

    // new post API logic 
    app.post("/api/posts", async(req,res)=>{
try {
    const response= await axios.post(`${api_url}/posts`, req.body);
    res.redirect("/")
} catch (error) {
    res.status(500).json({ message: "Error posting Blog" });
  }
});

// edit post api logic 
app.post("/api/posts/:id", async(req,res)=>{
    try {
        const response = await axios.patch(api_url+"/posts/"+req.params.id, req.body)
        res.redirect("/")
    } catch (error) {
       res.status(500).json({message:"error edit post"}); 
    }
})


// delete post api logic 
app.get("/api/posts/delete/:id", async(req,res)=>{
    try {
        const response = await axios.delete(`${api_url}/posts/${req.params.id}`);
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
      }
    });
    
app.listen(port, ()=>{
    console.log(`port ${port} is active!!`)
})