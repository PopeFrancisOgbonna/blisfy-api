const express = require('express');
const router = express.Router();
const client = require("../models/db");
const category = require('./categoryHandler');
const post = require("./postHandler");



router.get('/', (req, res) => {
  res.send("application in good health!!!");
});

//handling category section begins here
const newCategory = (req, res) => {category.addCategory(req, res, client)};
const allCategory = (req, res) => { category.allCategory(req, res, client) };
const deleteCategory = (req, res) => { category.delet_single(req, res, client) };

//post handlers 
const createPost = (req, res) => { post.createPost(req, res, client) };
const allPost = (req, res) => { post.allPost(req, res, client) };

module.exports = {
  newCategory,
  allCategory,
  deleteCategory,
  createPost,
  allPost,
}