const express = require('express')
require('./db/mongoose')
const req = require('express/lib/request')
const userRouter =require('./routers/users')
const taskRouter = require('../src/routers/tasks')

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
    console.log('server is u&R on port' + port)

})



