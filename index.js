const { response } = require('express')
const express = require('express')
const router = require('express').Router()
const cors = require('cors')
const Month = require('./models/month')
const { format } = require('./utils/format')
const dayjs = require('dayjs')

const app = express()

app.use(express.json())
app.use(cors())

app.post('/', async (req, res) => {

    const monthPresent = await Month.find({ monthYear: req.body.monthYear })

    if (monthPresent.length) {
        const [month] = format(monthPresent)

        const updatedEntries = { ...month.entries, [req.body.day]: req.body.entry }

        // if (month.entries[req.body.day]) {
        //     return res.status(400).json({ message: 'Already an entry' })
        // }
        
        const post = await Month.findOneAndUpdate(
            { monthYear: req.body.monthYear },
            { "entries": updatedEntries },
            { new: true }
          )

        res.status(200).json({ entries: post.entries, monthYear: post.monthYear })

    } else {
        const entry = new Month({
            monthYear: req.body.monthYear,
            entries: {}
        })

        entry.entries.set(`${req.body.day}`, `${req.body.entry}`)

        try {
            const savedEntry = await entry.save()
            res.status(200).json({ entries: savedEntry.entries, monthYear: savedEntry.monthYear })
        } catch (error) {
            res.status(400).json(error.errors)
        }
    }
})

app.get('/', async (req, res) => {
    const mongoRes = await Month.find({})

    const response = {}

    mongoRes.forEach(item => {
        const entriesObject = format(item.entries)
        response[item.monthYear] = entriesObject
        const entriesArray = Object.values(entriesObject)
        const sum = entriesArray.reduce((a, b) => (
            a + b
        ), 0)
        response[item.monthYear]['average'] = Number((sum / entriesArray.length).toFixed(2))
    })

    res.status(200).json(response)
})

app.delete('/reset', async(req, res) => {
    try {
        const mongoRes = await Month.deleteMany({})

        res.status(200).json({ message: 'success' })
    } catch(err) {
        res.status(400).json({ message: err })
    }

})

app.post('/testData/:year', async(req, res) => {
    
    try {

        const months = Array.from(Array(12), (x, i) => i + 1
            `${i + 1}/01/${req.params.year}`
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
                entries: randomMonthEntries(dayjs(el).daysInMonth())
            })
        ))

        const promiseArray = mongoEntries.map(entry => entry.save())

        await promiseArray

        res.status(200).json({ message: 'Success' })

    } catch(err) {
        res.status(400).json(err)
    }
})

app.listen(3001, () => {
    console.log('app is running');
});