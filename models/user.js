const mongoose = require("mongoose");
const bcrypt=require('bcrypt')
mongoose
  .connect("mongodb://localhost:27017/Voting")
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("database disconnected ", err);
  });

const UserSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    required:true
  },
  email:{
    type:String,
  },
  modile:{
    type:String,
  },
  address:{
    type:String,
    required:true
  },
  aadhaar:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["voter","admin"],
    default:"voter"
  },
  isVoted:{
    type:Boolean,
    default:false
  }

});

UserSchema.pre('save',async function(next){
    const user= this;
    if(!user.isModified('password')) return next();
    try{
       const  salt=await bcrypt.genSalt(10);
       const hashpassword= await bcrypt.hash(user.password,salt)
       user.password=hashpassword;
       next();
    }
    catch(err){
      return next(err)
    }

})

UserSchema.methods.comparePassword =  function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
  };

const User= mongoose.model("user", UserSchema);
module.exports=User;
