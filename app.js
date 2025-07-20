const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")


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

        })
})


app.post("/signIn",async (req,res) => {

    let input = req.body
    await userModel.find({email:input.email}).then(
        (result) => {

            if (result.length > 0) {

                let passwordValidator = bcrypt.compareSync(input.password,result[0].password)

                if (passwordValidator) 
                {
                    jwt.sign({email:input.email},"blogApp",{expiresIn:"1d"},
                        (error,token) => {

                            if (error) {

                                res.json({"Status":"error","errorMsg":error})
                                
                            } else {

                                res.json({"Status":"success","token":token,"userId":result[0]._id})
                                
                            }
                            
                            
                        })
    
                } else {

                    res.json({"Status":"InCorrect password"})
                    
                }
               
            } else {

                res.json({"Status":"Invalid Email id"})
                
            }
        }
    ).catch()
})


app.post("/createPost",async (req,res) => {

    let input = req.body

    // collect token and store in a variable
    let token = req.headers.token

    //verify token
     
    jwt.verify(token,"blogApp", async (error,decoded) => {

        if ( decoded ) {

            let result = new postModel(input)
            await result.save()
            res.json({"Status":"Post Created Successfully"})
            
        } else {

            res.json({"Status":"Invalid Authentication"})
            
        }
    })
})

app.post("/viewAll",(req,res) => {

    let token = req.headers.token
    
    jwt.verify(token,"blogApp",(error,decoded) => {

        if (decoded) {

            postModel.find().then(
                (items) => {

                    res.json(items)
                }
            ).catch(
                () => {
                    res.json({"Status":"Error"})
                } 
            )

            
        } else {
            res.json({"Status":"Invalid Authentication"})
        }
    })

})

app.post("/viewMyPost",(req,res) => {

    let input = req.body 
    let token = req.headers.token
    
    jwt.verify(token,"blogApp",(error,decoded) => {

        if (decoded) {

            postModel.find(input).then(
                (items) => {

                    res.json(items)
                }
            ).catch(
                () => {
                    res.json({"Status":"Error"})
                } 
            )

            
        } else {
            res.json({"Status":"Invalid Authentication"})
        }
    })

})


app.listen(4000,() => {

    console.log("server is running at port localhost:4000 ");
    
})