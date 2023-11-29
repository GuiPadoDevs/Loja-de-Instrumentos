const express = require("express")
const route = express.Router()

const Produtos = require("../models/produtos")

//Inclusao
route.post("/insereProduto", async (req, res) => {
    try {
        const { nome_produto, preco, quantidade, categoria, ativo } = req.body;

        // Verifica se todos os campos obrigatórios foram fornecidos
        if (!nome_produto || !preco || !quantidade === undefined || !categoria || ativo === undefined) {
            return res.status(400).send({ error: "Todos os campos são obrigatórios" });
        }

        // Cria um novo produto com os dados fornecidos
        const novoProduto = await Produtos.create({
            nome_produto,
            preco,
            quantidade,
            categoria,
            ativo
        });

        return res.status(201).send({ message: "Produto incluído com sucesso", produto: novoProduto });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Erro ao incluir produto" });
    }
});

//Selecionar
route.get("/", async (req, res) => {

    var data = await Produtos.find()
    return res.send( data )
})

//Alterar
route.put("/alteraProduto", async (req, res) => {
    var { id, nome_produto, preco, quantidade, categoria, ativo } = req.body

    if ( id == undefined)
        return res.send({ error: "Id não pode ser nulo" })

    try {
        var data = await Produtos.findById( id )
        

        var dados = {
            nome_produto,
            preco,
            quantidade,
            categoria,
            ativo
        }

        await Produtos.findByIdAndUpdate(
                                        id, 
                                        dados
                                    )

        return res.send( { mensagem: "Produto alterado com sucesso." } )

    }
    catch ( err ) {
        console.log( err )
        return res.send({ error: "Id não encontrado" })
    }
})

route.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const produto = await Produtos.findById(id);

        if (!produto) {
            return res.status(404).send({ error: "Produto não encontrado" });
        }

        await Produtos.findByIdAndRemove(id);
        return res.send({ message: "Produto removido com sucesso" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Erro ao deletar produto" });
    }
});
route.post("/venda", async (req, res) => {
    const { id, quantidadeVendida } = req.body;

    if (!id || quantidadeVendida == undefined) {
        return res.status(400).send({ error: "ID do produto e quantidade são obrigatórios" });
    }

    try {
        const produto = await Produtos.findById(id);

        if (!produto) {
            return res.status(404).send({ error: "Produto não encontrado" });
        }

        if (quantidadeVendida > produto.quantidade) {
            return res.status(400).send({ error: "Quantidade vendida excede o estoque" });
        }

        produto.quantidade -= quantidadeVendida;

        await produto.save();

        return res.send({ message: "Venda registrada com sucesso", produto });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Erro ao registrar venda" });
    }
});

route.get("/categoria/:categoria", async (req, res) => {
    try {
        const produtos = await Produtos.find({ categoria: req.params.categoria });
        res.send(produtos);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Erro ao buscar produtos por categoria" });
    }
});


module.exports = app => app.use("/produtos", route)
