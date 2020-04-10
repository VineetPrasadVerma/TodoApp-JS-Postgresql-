require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

const getAllLists = async (req, res) => {
  try {
    const results = await pool.query('SELECT * from lists')
    res.status(200).json(results.rows)
  } catch (e) {
    // console.log(e)
    res.status(500).json(e)
  }
}

module.exports = { getAllLists }
