const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://daangarcia92:coderhouse@cluster0.etwwao7.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión con la base de datos establecida."))
    .catch((error) => console.log("Error en la conexión con la base de datos.", error))
