const express = require('express')
require('./db/mongoose')
const routers = require('./routers')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(routers)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
