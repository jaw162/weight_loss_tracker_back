const Month = require('../models/month')
const User = require('../models/user')
const { format } = require('../utils/format')
const dayjs = require('dayjs')
const monthsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

monthsRouter.post('/', async (req, res) => {

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    const [month] = await Month.find({ monthYear: req.body.monthYear, user: decodedToken.id })

    if (month) {

        const formattedMonth = format(month)

        const updatedEntries = { ...formattedMonth.entries, [req.body.day]: req.body.entry }

        // if (month.entries[req.body.day]) {
        //     return res.status(400).json({ message: 'Already an entry' })
        // }
        
        const post = await Month.findOneAndUpdate(
            { monthYear: req.body.monthYear, user: user.id },
            { "entries": updatedEntries },
            { new: true }
          )

        // month.set('entries', updatedEntries)

        const posted = await post.save()

        res.status(200).json(posted)

    } else {
        const entry = new Month({
            monthYear: req.body.monthYear,
            entries: {},
            user: user.id
        })

        entry.entries.set(`${req.body.day}`, `${req.body.entry}`)

        try {
            const savedEntry = await entry.save()
            user.entries = user.entries.concat(savedEntry)
            const updatedUser = await user.save()
            res.status(200).json(savedEntry)
        } catch (error) {
            res.status(400).json(error.errors)
        }
    }
})

monthsRouter.get('/', async (req, res) => {
    const mongoRes = await Month.find({}).populate('user', { id: 1, username: 1 })

    const response = {}

    return res.json(mongoRes)

    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    mongoRes.forEach(item => {
        const entries = format(item)
        response[item.monthYear] = entries
        const entriesArray = Object.values(entries)
        const sum = entriesArray.reduce((a, b) => (
            a + b
        ), 0)
        response[item.monthYear]['average'] = Number((sum / entriesArray.length).toFixed(2))
    })

    res.status(200).json(response)
})

monthsRouter.delete('/reset', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    await Month.deleteMany({ user: decodedToken.id })

    const updatedUser = await User.findOneAndUpdate({ _id: decodedToken.id }, { 'entries': [] }, { new: true })

    // res.status(200).json({ message: 'success' })
    res.status(200).json(updatedUser)

})

monthsRouter.post('/testData/:year', async(req, res) => {

    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    
    try {

        const months = Array.from(Array(12), (x, i) =>(
            `${i + 1}/01/${req.params.year}`
            )
        )

        const randomMonthEntries = (daysInMonth) => {
            const obj = {}
            Array.from(Array(daysInMonth), (x, i) => (
                obj[i + 1] = Number((Math.random() * 100).toFixed(2))
            ))
            return obj
        }

        const mongoEntries = months.map(el => (
            new Month({
                monthYear: dayjs(el).format('M/YY'),
                entries: randomMonthEntries(dayjs(el).daysInMonth()),
                user: decodedToken.id
            })
        ))

        const promiseArray = mongoEntries.map(entry => entry.save())

        await promiseArray

        const updatedUser = await User.findOneAndUpdate({ _id: decodedToken.id }, { 'entries': mongoEntries }, { new: true })


        res.status(200).json({ message: 'Success' })

    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
})

module.exports = monthsRouter