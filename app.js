const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


app.get("/add",(req,res) => {

    res.send("welcome")
})


app.listen(4000,() => {

    console.log("server is running at port localhost:4000 ");
    
})