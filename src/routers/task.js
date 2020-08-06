const express = require('express')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { ObjectID } = require('mongodb')
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
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createAt:desc
router.get('/tasks', auth, async (req, res) => {
  const sort = {}

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    const tasks = await Task.find({
      owner: req.user._id,
      completed: req.query.completed ? req.query.completed === 'true' : [true, false]
    },
    null,
    {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort
    })
    res.send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

//Read task by id
router.get('/tasks/:id', auth, async (req, res) => {
  const { params: { id } } = req
  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id })
    if (!task)
      res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['title', 'description', 'completed', 'state']
  
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

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
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task)
      return res.status(404).send()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

// Add task comment
router.post('/tasks/:id/comments', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id })
    const { body: { comment } } = req
    
    if (!task)
    return res.status(404).send()
    
    const from = jwt.decode(req.token)
    task.comments.push({
      comment,
      from,
      id: new ObjectID(),
      createdAt: new Date()
    })
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.delete('/tasks/:id/comments/:commentId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id })

    if (!task)
      return res.status(404).send()

    const filteredComments = task.comments.filter(comment => comment.id.toHexString() !== req.params.commentId)
    task.comments = filteredComments
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router