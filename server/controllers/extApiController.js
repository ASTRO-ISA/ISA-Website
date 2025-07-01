// const axios = require('axios')
const cacheService = require('./cacheService')

exports.pictureOfTheDay = (req, res) => {
  const data = cacheService.pictureOfTheDay()
  if (!data) {
    return res.status(503).json({ message: 'Data not ready, please try later' })
  }
  res.json(data)
}

exports.upcomingLaunches = (req, res) => {
  const data = cacheService.getLaunches()
  if (!data) {
    return res.status(503).json({ message: 'Data not ready, please try later' })
  }
  res.json(data)
}

exports.externalBlogs = (req, res) => {
  const data = cacheService.getBlogs()
  if (!data) {
    return res.status(503).json({ message: 'Data not ready, please try later' })
  }
  res.json(data)
}

exports.newsArticles = (req, res) => {
  const data = cacheService.getArticles()
  if (!data) {
    return res.status(503).json({ message: 'Data not ready, please try later' })
  }
  res.json(data)
}


// exports.upcomingLaunches = async (req, res) => {
//     try{
//         const responce = await axios.get('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/')
//         res.json(responce.data.results)
//     } catch (err) {
//         res.status(500).json({message: 'Server error in upcomingLaunches'})
//     }
// }

// exports.externalBlogs = async (req, res) => {
//     try{
//         const responce = await axios.get('https://api.spaceflightnewsapi.net/v4/blogs')
//         res.json(responce.data.results)
//     } catch (err) {
//         res.status(500).json({message: 'Server error in extBlogs'})
//     }
// }

// exports.newsArticles = async (req, res) => {
//     try{
//         const responce = await axios.get('https://api.spaceflightnewsapi.net/v4/articles')
//         res.json(responce.data.results)
//     } catch (err) {
//         res.status(500).json({message: 'server error in newsArticles'})
//     }
// }