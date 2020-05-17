const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// Create user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// Login
router.post('/users/login', async (req, res) => {
  try {
    const { body: { email, password } } = req

    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
})

// Logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Logout all
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Get users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (e) {
    res.status(500).send()
  }
})

// Get me
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// Get user by id
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'password', 'email', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user)
    return res.status(404).send()
    
    updates.forEach(update => user[update] = req.body[update])
    await user.save()
    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user)
      return res.status(404).send()
    res.send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router