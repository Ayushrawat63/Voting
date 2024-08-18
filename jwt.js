const jwt = require('jsonwebtoken')

const VerifyTokenMiddlerware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(400).json({ error: "token not found" });
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.SECERT_KEY);
    // console.log(decoded)
    req.payload = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invaild token" });
  }
};

const GenerateToken = (userdata) => {
  return jwt.sign(userdata, process.env.SECERT_KEY);
};

module.exports = {
  VerifyTokenMiddlerware,
  GenerateToken,
};
