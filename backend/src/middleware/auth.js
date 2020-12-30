const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token")
        if(!token){
            return res.status(401).json({msg: 'Not auth token, auth denied'})
        }
        const verified = jwt.verify(token, process.env.JWT_TOKEN)
        if(!verified){
            return res.status(401).json({msg: 'Token verification failed, auth denied'})
        }

        req.user = verified.id
        next()
    }
    catch(e){
        return res.status(500).json({msg: e.message})
    }

}

module.exports = auth