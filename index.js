const express = require('express')
const monthsRouter = require('./controller/month')
const usersRouter = require('./controller/user')
const loginRouter = require('./controller/login')
const logoutRouter = require('./controller/logout')
const mw = require('./middleware')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

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
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173',
    credentials: true
}))

app.use(express.static('dist'))

app.use(express.json())
app.use(mw.getUser)
app.use(mw.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/months', monthsRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)



app.listen(process.env.PORT || 3001, () => {
    console.log('app is running');
});