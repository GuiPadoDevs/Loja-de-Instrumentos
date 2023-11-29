const mongoose = require("mongoose")

try {
    const uri = "mongodb+srv://GuiPadoDevs:GuiPadoDevs@cluster0.q3pclri.mongodb.net/LojaInstrumento"
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )    
}
catch (err) {
    console.log(err)
}

mongoose.Promise = global.Promise

module.exports = mongoose