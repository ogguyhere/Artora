const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({msg: "No token"});

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

    }
    catch(err)
    {
        res.status(403).json({msg:
            "Token is invalid"});
        
    }
};