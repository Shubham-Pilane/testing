const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
   
    name:String,
    email:String,
    password:String,
},{
    versionKey:false
});
// {
//     "name":"Shubham",
//     "email":"123@gmail.com",
//     "password":"123",
// }

const UserModel=mongoose.model("user",userSchema)

module.exports={
    UserModel
}