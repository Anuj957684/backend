const express = require('express');
const routes = express.Router();
const { authenticateToken } = require('../utilis/helper');

const upload = require("../utilis/fileUploader");
const { handleCreateBlog, handleGetAllBlogs, handleUpdateBlog, handleDeleteBlog, handleGetBlogById } = require('../controllers/blogs');


routes.post("/posts", upload.single("blogImage"), handleCreateBlog)
routes.get("/posts" ,  handleGetAllBlogs);
routes.get("/posts/:id" ,  handleGetBlogById)
routes.put("/posts/:id" ,  upload.single("blogImage"), handleUpdateBlog);
routes.delete("/posts/:id" ,  handleDeleteBlog)

module.exports = routes;