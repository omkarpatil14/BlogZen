require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL ||"mongodb+srv://omkarpatil9881:OmkarPatil14@cluster0.vor1jcf.mongodb.net/BlogZen?retryWrites=true&w=majority")
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/",checkForAuthenticationCookie("token"), async (req, res) => {
  const allBlogs = await Blog.find({});
   console.log(req.user);
 if(! req.user){
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
    
  });
 }else{
  if(req.user.role=="ADMIN"){
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
      role: req.user.role
    });
  }else{
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
      
    });
    
  }
 
 }
});




app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
