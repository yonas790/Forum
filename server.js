require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const userRouter = require('./server/api/users/user.router')




app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/api/users", userRouter)


app.listen(5000, () => {
    console.log(`Server is running on port ${port}`)
})
