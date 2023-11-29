const express = require('express')
const app = express()
const middleware = require("./middleware")

app.use(express.json())

require("./routes/login")(app)
require("./routes/pedido")(app);

app.use(middleware)

require("./routes/produtos")(app)


app.listen( 3001 , function() {

    console.log("Servidor ligado")
} )