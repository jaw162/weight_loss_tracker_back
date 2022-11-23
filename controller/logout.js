const cookie = require('cookie')
const logoutRouter = require('express').Router()

logoutRouter.post('/', async (request, response) => {

    response.setHeader('Set-Cookie', cookie.serialize('token', request.token, {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'production' ? true : 'none',
      secure: true
    }))
  
    response
      .status(200)
      .send({ message: 'Success' })
})

module.exports = logoutRouter