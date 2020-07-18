const express = require('express')
var cors = require('cors')
require('./db/mongoose')
const routers = require('./routers')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(routers)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
