const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config()

connectDB();
const app = express();

const port = process.env.PORT || 13454;

app.use(express.json())
app.use("/api/contacts", require('./routes/contactRoutes'))
app.use("/api/user", require('./routes/userRoutes'))
app.use(errorHandler)

app.listen(port,(req,res)=>{
    console.log(`Started listening in this ${port} port location`)
})