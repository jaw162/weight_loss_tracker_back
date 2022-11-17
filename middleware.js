const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  

const getToken = (req, res, next) => {
    if (req.path === '/api/login') return next()
    const auth = req.get('Cookie')
    if (!auth) return res.status(401).json({ message: 'unauthorized' })
    req.token = auth.substring(6)

    next()
}

module.exports = { getToken, requestLogger }