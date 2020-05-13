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
app.get('/users', async (req, res) => {

  try {
    const users = await User.find({})
    res.send(users)
  } catch (e) {
    res.status(500).send()
  }
})

// Get user by id
app.get('/users/:id', async (req, res) => {
  const { params: { id } } = req

  try {
    const user = await User.findById(id)
      if (!user)
        res.status(404).send()
      res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

// Update user
app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'password', 'email', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })

    if (!user)
      return res.status(404).send()
    res.send(user)
    
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user)
      return res.status(404).send()
    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})


// Create task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save() 
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Read tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Read task by id
app.get('/tasks/:id', async (req, res) => {
  const { params: { id } } = req
  try {
    const task = await Task.findById(id)
    if (!task)
      res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update task
app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })

    if (!task)
      return res.status(404).send()
    res.send(task)
    
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task)
      return res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
