const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save() 
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Read tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Read task by id
router.get('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const task = await Task.findById(req.params.id)

    if (!task)
      return res.status(404).send()
    
    updates.forEach(update => task[update] = req.body[update])
    
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task)
      return res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router