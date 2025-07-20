const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://alexlison:alexlison6885@cluster0.bz3d6.mongodb.net/blogDb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", async (req,res) => {

    let inputData = req.body
    let hashedPassword = bcrypt.hashSync(inputData.password,10)
    inputData.password = hashedPassword
    

     userModel.find({email:inputData.email}).then(

        async (items) => {

        if(items.length > 0 )
        {
            res.json({"Status":"Email id already Exists !"})

        }
        else
        {
            let result = new userModel(inputData)
            await result.save()
            res.json({"Status":"Success"})
        }


        }

     ).catch(

        (error) => {

            console.log(error)

        }
     )

})


app.listen(4000,() => {

    console.log("server is running at port localhost:4000 ");
    
})