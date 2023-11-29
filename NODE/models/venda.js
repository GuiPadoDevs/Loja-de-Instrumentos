const mongoose = require('./database');

const VendaSchema = new mongoose.Schema({
    pedido_id: {
        type: String,
        required: true
    },
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
});

const Venda = mongoose.model('Venda', VendaSchema);

module.exports = Venda;