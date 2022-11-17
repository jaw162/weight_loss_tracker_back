const express = require('express')
const cors = require('cors')
const monthsRouter = require('./controller/month')
const usersRouter = require('./controller/user')
const loginRouter = require('./controller/login')
const logoutRouter = require('./controller/logout')
const mw = require('./middleware')
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('Success')
    })
    .catch((err) => {
        console.log(err)
    })

const app = express()

app.use(express.json())
app.use(cors())
app.use(mw.getToken)
app.use(mw.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/months', monthsRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)



app.listen(3001, () => {
    console.log('app is running');
});