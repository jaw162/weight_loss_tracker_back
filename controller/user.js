const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { format } = require('../utils/format')

usersRouter.get('/me', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const { entries } = await User.findById(decodedToken.id).populate('entries', { monthYear: 1, entries: 1 })

    const formattedResponse = {}
    
    entries.forEach(item => {
      const formattedItem = format(item)
      formattedResponse[item.monthYear] = formattedItem.entries
      const entriesArray = Object.values(formattedItem.entries)
      const sum = entriesArray.reduce((a, b) => a + b, 0)
      formattedResponse[item.monthYear]['average'] = Number((sum / entriesArray.length).toFixed(2))
  })
  
    response.json(formattedResponse)
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
  
  module.exports = usersRouter