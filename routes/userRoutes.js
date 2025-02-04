const express = require('express');
const routes = express.Router();
const { handleRegister, handleLogin } = require('../controllers/user');
const upload = require("../utilis/fileUploader")


routes.post("/register", upload.single("photo"), handleRegister)

routes.post("/login", handleLogin);


module.exports = routes;