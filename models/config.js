const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
    // unit: {
    //     type: String,
    //     required: true,
    //     validate: {
    //         validator: (v) => {
    //             return /(\bkg\b|\blbs\b)/.test(v)
    //         },
    //         message: props => `Must be either kg or lbs`
    //     }
    // },
    goal: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

configSchema.set('toJSON', { transform: true })

module.exports = mongoose.model('Config', configSchema)