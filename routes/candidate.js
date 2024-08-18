const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Candidate = require("../models/candidate");
const { VerifyTokenMiddlerware, GenerateToken } = require("../jwt");

const candidateRole = async (userid) => {
  try {
    // console.log(userid);
    const user = await User.findById({ _id: userid });
    // console.log(user);
    if (user.role === "admin") return true;
    else return false;
  } catch {
    console.log("user not found");
  }
};

router.post("/signup", VerifyTokenMiddlerware, async (req, res) => {
  try {
    if (!(await candidateRole(req.payload.id)))
      return res.status(403).json({ error: "user does not have admin role" });

    const body = req.body;
    //  console.log(body)
    const newCandidate = new Candidate(body);
    const candidatedata = await newCandidate.save();
    console.log("data added to database");
    res.status(200).json({ content: candidatedata });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.put("/update/:candidateId", VerifyTokenMiddlerware, async (req, res) => {
  try {
    if (!(await candidateRole(req.payload.id)))
      return res.status(403).json({ error: "user does not have admin role" });
    const updateCandidateBody = req.body;
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndUpdate(
      { _id: candidateId },
      updateCandidateBody,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response)
      return res.status(400).json({ error: "Candidate not found" });

    res.status(200).json({ response, message: "Updated candidate info" });
  } catch (error) {
    console.log("Internal server error", error);
    res.status(500).json({ status: "internal server error" });
  }
});

router.delete(
  "/delete/:candidateId",
  VerifyTokenMiddlerware,
  async (req, res) => {
    try {
      if (!(await candidateRole(req.payload.id)))
        return res.status(403).json({ error: "user does not have admin role" });

      const response = await Candidate.findByIdAndDelete({
        _id: req.params.candidateId,
      });
      if (!response)
        return res.status(400).json({ error: "Candidate not found" });
      res.status(201).json("candidate deleted");
    } catch (error) {
      console.log("Internal server error", error);
      res.status(500).json({ status: "internal server error" });
    }
  }
);


//votes section

router.post('/vote/:candidateId',VerifyTokenMiddlerware,async (req,res)=>{
    const userId=req.payload.id;
    const candidateId=req.params.candidateId;
    try{
     const user=await User.findById({_id:userId})
     const candidate=await Candidate.findById({_id:candidateId})

     if(!user){
        return res.status(400).json("User not found")
     }
     if(!candidate){
        return res.status(400).json("Candidate not found")
     }
     if(user.isVoted)
     {
        return res.status(400).json("user allready voted")
     }
     if(user.role=="admin")
     {
        return res.status(400).json("Admin is not allowed to vote")   
     }
    
    //  candidate update

    candidate.votes.push({
        user:user.id
    })
    candidate.voteCount++
    await candidate.save();

    //user update

    user.isVoted=true;
    await user.save();

    res.status(201).json("User voted successfully");

    }
    catch(err){
        console.log("Internal server error", err);
        res.status(500).json({ status: "internal server error" });     
    }
})

router.get('/vote/count',async(req,res)=>{
    try{ 
        const candidates=await Candidate.find().sort({voteCount:-1});
        // console.log(candidates)

        const voteRecord= candidates.map((elem)=>{
            return({
                party:elem.partyName,
                count:elem.voteCount
            })
        })
       return res.status(200).json(voteRecord);

    }
    catch(err){
        console.log("Internal server error", err);
        res.status(500).json({ status: "internal server error" });     
    }
})

router.get('/',async(req,res)=>{
    try{
        const candidates=await Candidate.find();
        // console.log(candidates)

        const voteRecord= candidates.map((elem)=>{
            return({
                party:elem.partyName,
                Leader:elem.leaderName
            })
        })
       return res.status(200).json(voteRecord);
    }
    catch(err){
        console.log("Internal server error", err);
        res.status(500).json({ status: "internal server error" });     
    }
})

module.exports = router;
