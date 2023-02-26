import JWT from "jsonwebtoken";
const JWT_SECRETE = "jay@123";

const fetchuser=(req, res, next)=>{
    const token = req.header('Authorization')
    if(!token){
        res.status(401).send({error:"Invalid token"})
    }

    const data = JWT.verify(token, JWT_SECRETE)
    req.user = data.user;
    next();
}


export default fetchuser;