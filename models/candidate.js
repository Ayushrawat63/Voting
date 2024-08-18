const mongoose = require("mongoose");


const CandidateSchema = mongoose.Schema({
    leaderName:{
    type:String,
    required:true
    },
    partyName:{
        type:String,
        required:true  
    },
    age:{
        type:Number,
        required:true
      },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user',
                required:true
            },
            timeAt:{
                type:Date,
                default: Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model("candidate", CandidateSchema);
