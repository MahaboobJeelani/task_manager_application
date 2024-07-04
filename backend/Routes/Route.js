const express = require('express')
const { register, login, createTask, editTask, deleteTask, tokenMiddleware } = require('../Controllers/Controller')


const routes = express.Router()



routes.post('/register', register)
routes.post('/login', login)
routes.post('/:id', createTask)
routes.get('/:id', getTask)
routes.put('/:_id/:_taskid', editTask)
routes.delete('/:id/:taskid', deleteTask)

module.exports = routes