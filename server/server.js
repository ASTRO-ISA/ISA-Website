const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config() // we need this to load our environment variables present in dotenv file

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION, SHUTTING DOWN...')
  console.log(err.name, err.message)
  process.exit(1)
})

// Load environment variables
dotenv.config({ path: './config.env' })

const app = require('./app')

// connect to mongoDB
mongoose
  .connect(process.env.DB_URL, {
    ssl: true
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  })

// to auto delete events
require('./utils/autoDeleteEvent')

// Start the server
const port = process.env.port || 3000
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
