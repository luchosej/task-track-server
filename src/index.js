const express = require('express')
require('./db/mongoose')
const Task = require('./db/models/task')
const User = require('./db/models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

// Create user
app.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Get users
app.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((e) => res.status(500).send())
})

// Get user by id
app.get('/users/:id', (req, res) => {
  const { params: { id } } = req

  console.log(id)
  User.findById(id)
    .then((user) => {
      if (!user)
        res.status(404).send()
      res.send(user)
    })
    .catch((e) => res.status(500).send())
})


// Create task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save()
    .then(() => res.status(201).send(task))
    .catch((e) => res.status(400).send(e))
})

// Read tasks
app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => res.send(tasks))
    .catch((e) => res.status(500).send())
})

//Read task by id
app.get('/tasks/:id', (req, res) => {
  const { params: { id } } = req

  Task.findById(id)
    .then((task) => {
      if (!task)
        res.status(404).send()
      res.send(task)
    })
})


app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
