const express = require("express");
const auth = require('../Middleware/authentication');
const { createPost, getAllPost, updatePost, getOnePost, deletePost } = require('../Controller');

const router = express.Router();

router.route("/post")
    .post(auth, createPost)
    .get(auth, getAllPost)


router.route("/post/:id")
    .put(auth, updatePost)
    .get(auth, getOnePost)
    .delete(auth, deletePost)

module.exports = router