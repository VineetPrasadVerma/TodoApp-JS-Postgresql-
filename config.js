require('dotenv').config()

const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
})

// const pool = new Pool({
//   user: 'vineet',
//   host: 'localhost',
//   database: 'todos',
//   password: '123',
//   port: 5432
// })

// pool.on('connect', () => console.log('Connnected to DB'))

module.exports = { pool }
