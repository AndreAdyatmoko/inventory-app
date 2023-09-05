const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve("../.env"),
});


const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send("Belum Login");
  
  try {
      token = token.split(" ")[1];
      console.log(token);

    if (token === "null" || !token)
      return res.status(401).send("access denied");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedUser) return res.status(401).send("unauthorized request");

    req.user = verifiedUser;

    next();
  } catch (err) {
    return res.status(400).send("Token Expired");
  }
};


module.exports =  {verifyToken} ;