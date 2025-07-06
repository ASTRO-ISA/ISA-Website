const Blogs = require('../models/blogModel')

exports.setFeaturedBlog = async (req, res) => {
    try{
        const {id} = req.params
        await Blogs.findByIdAndUpdate(id, { featured: true })
        res.status(200).json('Blog is now featured.')
    }
    catch (err) {
        res.status(500).json('server error in setFeaturedBlog', err)
    }
}

exports.removeFeaturedBlog = async (req, res) => {
    try{
        const {id} = req.params
        await Blogs.findByIdAndUpdate(id, { featured: false })
        res.status(200).json('Blog is no more featured.')
    }
    catch (err) {
        res.status(500).json('server error in removeFeaturedBlog', err)
    }
}