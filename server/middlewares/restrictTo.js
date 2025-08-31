const restrictTo = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next()
    } else {
      return res.status(403).json({ message: 'Forbidden: Access denied' })
    }
  }
}

module.exports = restrictTo
