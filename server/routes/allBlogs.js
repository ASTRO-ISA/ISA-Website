const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

router.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});

        if(!allBlogs) {
            res.status(404).json({message: 'Nothing to see here right now!'});
        }

        res.status(200).json(allBlogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server Error'});
    }
})

module.exports = router;