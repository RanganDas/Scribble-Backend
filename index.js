const connectToMongo= require("./db")
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const cors=require('cors')


app.use(cors())
connectToMongo()

app.use(express.json())
//Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Scribble backend is listening on port ${port}`)
})