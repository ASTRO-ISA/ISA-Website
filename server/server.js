process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION, SHUTTING DOWN...')
  console.log(err.name, err.message)
  process.exit(1)
})

const app = require('./app')

// Start the server
const port = 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

// Handle asynchronous errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, SHUTTING DOWN')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
