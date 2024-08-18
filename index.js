const express= require('express')
const app= express();
require("dotenv").config();
const Port = process.env.PORT || 3000;

const userRoute=require('./routes/voterRoutes')
const candidateRoute=require('./routes/candidate')
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
     res.send("welcome to the voting website")
})

app.use('/user',userRoute);
app.use('/candidate',candidateRoute)

app.listen(Port,()=>{
    console.log("server started")
})