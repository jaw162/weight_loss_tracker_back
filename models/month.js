const mongoose = require('mongoose')

const monthSchema = new mongoose.Schema({
    monthYear: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return /(\b[1-9]{1}\b|\b(1[012])\b)\/\b(2[234])\b/.test(v)
            },
            message: props => `Please use the correct date format (e.g. MM/YY or M/YY)`
        }
    },
    entries: {
        type: Map,
        of: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

monthSchema.set('toJSON', { transform: true })

module.exports = mongoose.model('Month', monthSchema)