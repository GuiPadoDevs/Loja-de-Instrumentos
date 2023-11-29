const mongoose = require('./database');

const { Schema } = mongoose;


const ProdutosSchema = new Schema({
    nome_produto: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: { 
        type: String,
        default: true
    },
    ativo: { 
        type: Boolean,
        default: true
    }
});

const Produto = mongoose.model('Produtos', ProdutosSchema);

module.exports = Produto;