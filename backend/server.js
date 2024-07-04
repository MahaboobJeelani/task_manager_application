const express = require('express')
const taskRoutes = require('./Routes/Route')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())

mongoose.connect('mongodb://0.0.0.0:27017/taskManager')
    .then(() => { console.log('Server is connected to the node js application'); })
    .catch((error) => { console.log(error); })

app.use('/task', taskRoutes)


app.listen(process.env.PORT, () => console.log(`Server is running on the port ${process.env.PORT}`))
