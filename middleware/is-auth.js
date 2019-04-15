const jwt = require("jsonwebtoken")

// Express server function export
module.exports = (req, res, next) => {
    // Check to see if the request headers container an Authorization object
    const authHeader = req.get("Authorization")
    if(!authHeader){
        // if no header set isAuth to false and break to the next() function
        req.isAuth = false;
        return next();
    }
    // Authorization bearer <TOKENVALUE>
    // because we  
    const token = authHeader.split(" ")[1]
    if(!token || token === ""){
        req.isAuth = false;
        return next();
    }
    let decodedToken
    try{
        // need to use the same key as defined within auth.js
    decodedToken = jwt.verify(token, "somesecretsuperkey")
    }catch(err){
        req.isAuth = false;
        return next()
    }
    if(!decodedToken){
        req.isAuth = false;
        return next()
    }
    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}