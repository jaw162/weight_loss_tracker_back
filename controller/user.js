const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Config = require('../models/config')
const { format } = require('../utils/format')

usersRouter.get('/me', async (request, response) => {
    const { entries, config } = await User.findById(request.user.id).populate('config').populate('entries', { monthYear: 1, entries: 1 })

    const formattedResponse = {}
    
    entries.forEach(item => {
      const formattedItem = format(item)
      formattedResponse[item.monthYear] = formattedItem.entries
      const entriesArray = Object.values(formattedItem.entries)
      const sum = entriesArray.reduce((a, b) => a + b, 0)
      formattedResponse[item.monthYear]['average'] = Number((sum / entriesArray.length).toFixed(2))
  })
  
    response.status(200).json({ data: formattedResponse, 'goal-weight': config.goal })
})

usersRouter.get('/check', async (request, response) => {
  
    const user = User.findById(request.user.id).populate('username')

    return response.status(200).json({ message: 'Welcome Back' })
})

usersRouter.post('/', async (request, response) => {
    const { username, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})

usersRouter.post('/config', async (request, response) => {
  
    const alreadyEntered = await Config.find({ user: request.user.id })
    const user = await User.findById(request.user.id)
  
    if (alreadyEntered.length) {

      const updated = await Config.findOneAndUpdate(
        { user: request.user.id },
        { "goal": request.body.goal },
        { new: true }
      )

      return response.status(200).json(updated)

    } else {
      const config = new Config({ goal: request.body.goal, user: request.user.id })
      user.config = config

      const posted = await config.save()
      const updatedUser = await user.save()

      return response.status(200).json(updatedUser)
    }
})
  
  module.exports = usersRouter