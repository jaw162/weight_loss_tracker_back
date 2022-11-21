const bcrypt = require('bcrypt')
const configRouter = require('express').Router()
const Config = require('../models/config')
const jwt = require('jsonwebtoken')
const { format } = require('../utils/format')

usersRouter.get('/me', async (request, response) => {
    const { entries } = await User.findById(request.user.id).populate('entries', { monthYear: 1, entries: 1 })

    const formattedResponse = {}
    
    entries.forEach(item => {
      const formattedItem = format(item)
      formattedResponse[item.monthYear] = formattedItem.entries
      const entriesArray = Object.values(formattedItem.entries)
      const sum = entriesArray.reduce((a, b) => a + b, 0)
      formattedResponse[item.monthYear]['average'] = Number((sum / entriesArray.length).toFixed(2))
  })
  
    response.status(200).json(formattedResponse)
})