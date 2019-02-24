const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    googleID:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
       
    },
    lastName:{
        type:String,
       
    },
    image:{
        type:String,
       
    }
});

mongoose.model('users',userSchema);