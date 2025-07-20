const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        userId : { type: mongoose.Schema.Types.ObjectId, ref:"users" },
        message : { type : String , required : true },
        postDate : { type : Date , default: Date.now }
    }
)

const postModel = mongoose.model("posts",postSchema)
module.exports = postModel