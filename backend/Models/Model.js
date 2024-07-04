const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
    username: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 4 },
    tasks: [{ title: { type: String }, description: { type: String }, dueDate: { type: String, default: Date.now() }, status: { type: String, default: 'pending' } }]
})

const studentModel = mongoose.model('task', loginSchema)

module.exports = studentModel