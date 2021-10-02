require("dotenv").config()
const { sequelize } = require('./models')
const express = require('express')
const cors = require('cors')
const bodyPaser = require('body-parser')
const app = express()

app.use(cors({origin: true, credentials: true}))
app.use(express.json())
app.use(bodyPaser.urlencoded({extended:false}))
app.use('/user', require('./router/user'))
app.use('/money', require('./router/money'))
app.use('/auth', require('./router/auth'))

app.listen({ port: process.env.PORT }, async () => {
    console.log(`Server is runing on port ${process.env.PORT}`)
    await sequelize.authenticate()
    console.log("Database Connected!")
})
