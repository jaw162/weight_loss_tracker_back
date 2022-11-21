const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  

const getUser = (req, res, next) => {
    if (req.path === '/api/login') return next()
    const auth = req.get('Cookie')
    if (!auth) return res.status(401).json({ message: 'unauthorized' })
    req.token = auth.substring(6)
    req.user = jwt.verify(auth.substring(6), process.env.SECRET)

    next()
}

// const allowAccess = (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
//   res.setHeader('Access-Control-Allow-Headers', 'content-type')
//   res.setHeader('Access-Control-Allow-Methods', '*')
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   console.log(req.headers.origin)
//   next()
// }

module.exports = { getUser, requestLogger }