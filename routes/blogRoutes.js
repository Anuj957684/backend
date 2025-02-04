const express = require('express');
const routes = express.Router();
const { authenticateToken } = require('../utilis/helper');

const upload = require("../utilis/fileUploader");
const { handleCreateBlog, handleGetAllBlogs, handleUpdateBlog, handleDeleteBlog, handleGetBlogById } = require('../controllers/blogs');


routes.post("/posts", authenticateToken, upload.single("blogImage"), handleCreateBlog)
routes.get("/posts" , authenticateToken, handleGetAllBlogs);
routes.get("/posts/:id" ,  authenticateToken ,handleGetBlogById)
routes.put("/posts/:id" , authenticateToken, upload.single("blogImage"), handleUpdateBlog);
routes.delete("/posts/:id" , authenticateToken, handleDeleteBlog)

module.exports = routes;