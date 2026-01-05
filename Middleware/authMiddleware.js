const jwt = require('jsonwebtoken');
const secretKey = require('../Configuration/jwtConfig');
const User = require('../Module/userModule');

const verifyuser = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    // console.log("Token extracted:", header);
    if (!header) {
      return res.status(404).json({ success: false, error: "Token Missing" });
    }


    const token = header.split(" ")[1];
    // console.log("Token extracted:", token);
    if (!token) {
      return res.status(404).json({ success: false, error: "Token Not Provided" });
    }

    const decoded = jwt.verify(token, secretKey);
    // console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid Token" });
  }
};

module.exports = verifyuser;
