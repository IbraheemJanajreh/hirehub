const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');
const UserSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    company:{
        type:Boolean,
        required:true
    },
    image:{
        url:String,
        filename:String
    },

    phone:{
        type:String,
        required:true
    },

    profession:{
        type:String,
        required:false
    },

    skills :[{
        type: String,
        requierd: false
    }]
});
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',UserSchema);