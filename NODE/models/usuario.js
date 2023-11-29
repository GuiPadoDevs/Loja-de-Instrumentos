const { hashSync } = require('bcrypt')
const mongoose = require('./database')
const { Schema } = mongoose
const Usuarios = new Schema({
    email: {
        type: String,
        required: true
    },
    senha: String,
    chave: String
})
/*
Nao utilizado
Faz a criptografia da senha, sempre q ela for alterada ou criada.
OBS: sem a necessidade do bcrypt em alterarsenha

Usuarios.pre('save', async function(next){
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash
    next()
})
*/

const Usuario = mongoose.model('Usuario', Usuarios)
module.exports = Usuario