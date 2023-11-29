const jwt = require("jsonwebtoken")
require("dotenv/config")
module.exports = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token)
        return res.send({ error: "Token não foi encontrado"})
    
    var chave = token
    await jwt.verify(chave, 
                    process.env.TOKEN_KEY, 
                    (erro, data) =>{
        if (erro)
            return res.send({ error: "Token inválido ou já expirou"})
    })
    

    return next()
}