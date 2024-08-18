const express= require('express')
const router=express.Router()
const bcrypt =require('bcrypt')

const User=require('../models/user')
const {VerifyTokenMiddlerware,GenerateToken}=require('../jwt')

router.get('/profile',VerifyTokenMiddlerware,async (req,res)=>{
    try{
        // console.log(req.payload)
        const userPayload=req.payload;
        // console.log(userPayload);
        const user = await User.findById({_id:userPayload.id})
           res.status(201).json(user)
    }
    catch(error)
   {
       console.log("Internal server error",error)
       res.status(500).json({status:"internal server error"})
   }
})

router.put('/profile/password',VerifyTokenMiddlerware,async(req,res)=>{
    try{
       const {currentPassword,newPassword,confirmPassword}=req.body
       if(newPassword != confirmPassword) return res.status(400).json({error:"Currentpassword and confirmPassword does not match"})
        const userPayload=req.payload;
        // console.log(userPayload);
        const user = await User.findById({_id:userPayload.id})
       const  isMatch= await bcrypt.compare(currentPassword,user.password)
    //    console.log(isMatch);
       if(!isMatch) return res.status(400).json({message:"password is wrong"})
      
        user.password=newPassword;
       user.save();
       res.status(200).json({message:"Updated password"})

    }
    catch(error)
    {
        console.log("Internal server error",error)
        res.status(500).json({status:"internal server error"})
    }
})

router.post('/signup',async (req,res)=>{
   try{
     const body=req.body;
    //  console.log(body)
     const newuser= new User(body) 
     const userdata=await newuser.save()
     console.log("data added to database")
     const payload={
        id:userdata._id,
     }
     const token=GenerateToken(payload);
     res.status(200).json({content:userdata,token:token})
   }
   catch(err){
    console.log(err)
    res.status(500).json({error:err})
   }
})
router.post('/login',async(req,res)=>{
    try{
        const {aadhaar,password}=req.body
        const user=await User.findOne({aadhaar});
        if(!user) return res.status(401).json({error:"Username is not vaild"})
            // console.log(user);
           await user.comparePassword(password,function(err, isMatch) {
            if (err) throw err;
            // console.log(password, isMatch);
            if(!isMatch)  return  res.status(401).json({error:"Password is not vaild"})
                // generate token
              const payload={
                id:user.id,
                username:user.username
              }
              const token=GenerateToken(payload)
                return  res.status(201).json({status:"Successfull login ",token})
            })    

    }
    catch(err){
        console.log(err)
        res.status(500).json({error:err})
       }
})

module.exports =router;