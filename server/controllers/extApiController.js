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

exports.astronomyCalender = (req, res) => {
  const data = cacheService.getAstronomyCalender()
  if (!data) {
    return res.status(503).json({ message: 'Data not ready, please try later' })
  }
  res.json(data)
}
