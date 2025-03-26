const express = require('express');
const routes = express.Router();
const Auth = require('../middleware/Auth')
const { authenticateToken } = require('../utilis/helper');

const upload = require("../utilis/fileUploader");
const { handleCreateBlog, handleGetAllBlogs, handleUpdateBlog, handleDeleteBlog, handleGetBlogById } = require('../controllers/blogs');


routes.post("/posts", Auth, upload.single("blogImage"), handleCreateBlog)
routes.get("/posts" , Auth,  handleGetAllBlogs);
routes.get("/posts/:id" , Auth,  handleGetBlogById)
routes.put("/posts/:id" , Auth,  upload.single("blogImage"), handleUpdateBlog);
routes.delete("/posts/:id" , Auth, handleDeleteBlog)

module.exports = routes;