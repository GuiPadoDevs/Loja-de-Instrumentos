const mongoose = require('./database');

const PedidoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    itens: [{
        produtoId: mongoose.Schema.Types.ObjectId,
        quantidade: Number,
        precoUnitario: Number,
        total: Number
    }],
    chave: String
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;