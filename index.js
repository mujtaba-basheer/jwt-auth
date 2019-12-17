const express = require('express')
const app = express()
const routes = require('./routes')

app.use(express.json())

app.use('/api/user', routes)

app.listen(5000, () => {
    console.log('Server up and running...')
})