const express = require("express")
const route = express.Router()
const jwt = require("jsonwebtoken")
const Email = require("../components/email")
const bcrypt = require('bcrypt')

require('dotenv/config')

const Usuario = require('../models/usuario')
const Produto = require('../models/produtos');
const Venda = require('../models/venda');
const Pedido = require('../models/pedido');

route.post("/enviaPedido", async (req, res) => {
    const { email, senha, id_produto, quantidade } = req.body

    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"})

    if (!senha)
        return res.send({ msg: "Campo senha é obrigatório"})


    var usuario = await Usuario.findOne({ email })

    if (!usuario)
        return res.send({ msg: "Usuário ou senha inválido"})

    var valida_senha = await bcrypt.compare(senha, usuario.senha)
    // true ou false

    if (!valida_senha)
        return res.send({ msg: "Usuário ou senha inválido"})

    //1
    var dados = {
        id: usuario.id,
        email: usuario.email
    }

    //2
    var chave = process.env.TOKEN_KEY

    //3
    var tempo = { expiresIn: 60 * 1000 } //1 minuto
    
    var token = await jwt.sign(dados, chave, tempo)
    var numero = [
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9)
    ]
    numero = numero.join('')
    const produto = await Produto.findById(id_produto);
    if (!produto) {
        return res.status(404).send({ msg: "Produto não encontrado" });
    }

    // Calculando o total do pedido
    const precoTotal = produto.preco * quantidade;

    const novoPedido = await Pedido.create({
        email: email,
        itens: [{ produtoId: produto._id, quantidade, precoUnitario: produto.preco, total: precoTotal }],
        chave: numero
    });
    const detalhesPedido = {
        nomeProduto: produto.nome_produto,
        quantidade: quantidade,
        precoUnitario: produto.preco,
        categoria: produto.categoria,
        total: precoTotal
    };

    Email.ConfirmaPedido(email, numero, detalhesPedido.nomeProduto, detalhesPedido.quantidade, detalhesPedido.categoria, detalhesPedido.total)
    //res.send({ pedido })
    return res.send({ token,novoPedido })
})

route.post("/formalizaVenda", async (req, res) => {
    const { email, senha, id_pedido, chave_compra } = req.body

    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"})

    if (!senha)
        return res.send({ msg: "Campo senha é obrigatório"})


    var usuario = await Usuario.findOne({ email })

    if (!usuario)
        return res.send({ msg: "Usuário ou senha inválido"})

    var valida_senha = await bcrypt.compare(senha, usuario.senha)
    // true ou false

    if (!valida_senha)
        return res.send({ msg: "Usuário ou senha inválido"})

    //1
    var dados = {
        id: usuario.id,
        email: usuario.email
    }

    //2
    var chave = process.env.TOKEN_KEY

    //3
    var tempo = { expiresIn: 60 * 1000 } //1 minuto
    
    var token = await jwt.sign(dados, chave, tempo)
    const pedidoToVenda = await Pedido.findById(id_pedido);
    if (!pedidoToVenda) {
        return res.status(404).send({ msg: "Pedido não encontrado" });
    }
   if(chave_compra != pedidoToVenda.chave || email != pedidoToVenda.email)
   {
        return res.status(404).send({ msg: "Chave ou login inválido" });
   }
   else
   {
        const novaVenda = await Venda.create({
            pedido_id: id_pedido,
            email: email,
            itens: pedidoToVenda.itens
        });
   }
    return res.send({ token,pedidoToVenda })
})
// Supondo que este código esteja no mesmo arquivo das suas rotas existentes

// Rota para obter itens comprados, ordenados por usuário
route.get("/comprasItensCliente", async (req, res) => {
    try {
        const resumoCompras = await Venda.aggregate([
            { $unwind: '$itens' }, // Desestrutura o array de itens
            { $group: { 
                _id: { email: '$email', produtoId: '$itens.produtoId' }, // Agrupa por e-mail e ID do produto
                quantidadeTotal: { $sum: '$itens.quantidade' } // Soma a quantidade total de cada produto para cada cliente
            }},
            { $lookup: {
                from: 'produtos', // Nome da coleção de produtos
                localField: '_id.produtoId',
                foreignField: '_id',
                as: 'produtoInfo'
            }},
            { $unwind: '$produtoInfo' }, // Desestrutura o resultado do lookup
            { $project: { 
                _id: 0,
                produto: '$produtoInfo.nome_produto',
                email: '$_id.email',
                quantidadeTotal: 1
            }} // Seleciona apenas os campos desejados
        ]);

        res.send(resumoCompras);
    } catch (error) {
        res.status(500).send({ msg: "Erro ao buscar resumo de compras", error: error.message });
    }
});
// Rota para obter o histórico de compras de um cliente
route.post("/historicoComprasCliente", async (req, res) => {
    const { email } = req.body; // Recebe o e-mail do cliente

    if (!email) {
        return res.status(400).send({ msg: "E-mail do cliente é obrigatório" });
    }

    try {
        const historicoCompras = await Venda.find({ email: email }).populate({
            path: 'pedido_id',
            populate: {
                path: 'itens.produtoId',
                model: 'Produtos' // Nome do modelo de produtos
            }
        });

        res.send(historicoCompras);
    } catch (error) {
        res.status(500).send({ msg: "Erro ao buscar histórico de compras", error: error.message });
    }
});



module.exports = app => app.use("/pedido", route)