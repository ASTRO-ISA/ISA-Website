const axios = require('axios')
const cron = require('node-cron')
require('dotenv').config()

let cache = {
  potd: null,
  launches: null,
  blogs: null,
  articles: null
}

let timestamps = {
  potd: null,
  launches: null,
  blogs: null,
  articles: null
}

const pictureOfTheDay = async () => {
  try {
    const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.POTD_API_KEY}`)
    cache.potd = res.data
    timestamps.potd = new Date()
  } catch (err) {
    console.error('failed to fetch potd:', err.message)
  }
}

const fetchLaunches = async () => {
  try {
    const res = await axios.get('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/')
    cache.launches = res.data.results
    timestamps.launches = new Date()
  } catch (err) {
    console.error('Failed to fetch launches:', err.message)
  }
}

const fetchBlogs = async () => {
  try {
    const res = await axios.get('https://api.spaceflightnewsapi.net/v4/blogs')
    cache.blogs = res.data.results
    timestamps.blogs = new Date()
  } catch (err) {
    console.error('Failed to fetch blogs:', err.message)
  }
};

const fetchArticles = async () => {
  try {
    const res = await axios.get('https://api.spaceflightnewsapi.net/v4/articles')
    cache.articles = res.data.results
    timestamps.articles = new Date()
  } catch (err) {
    console.error('Failed to fetch articles:', err.message)
  }
}

// on first run
pictureOfTheDay()
fetchLaunches()
fetchBlogs()
fetchArticles()

// every 20 minutes but not at the same time, we are calling them at differnt time so they dont fire at once
cron.schedule('0,20,40 * * * *', fetchLaunches)
cron.schedule('5,25,45 * * * *', fetchBlogs)
cron.schedule('10,30,50 * * * *', fetchArticles)

// only once a day at 00:10 AM
cron.schedule('0 */3 * * *', pictureOfTheDay)

module.exports = {
  pictureOfTheDay: () => cache.potd,
  getLaunches: () => cache.launches,
  getBlogs: () => cache.blogs,
  getArticles: () => cache.articles,
  timestamps
}