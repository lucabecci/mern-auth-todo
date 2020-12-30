const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 4000
//run
app.listen(PORT, (error) => {
    if(error){
        console.log('Error to initialize the server', error)
    }

    console.log('Server on port:', PORT)
})

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;

    console.log('Database is connected')
})

//routes

app.use('/users', require('./routes/user.routes'))