const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");
//const path = require('path');


const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
//app.use(express.static(path.join(__dirname, 'public')));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: 
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// renderizado del chat en la pantalla
//app.get("/", (req,res) => {
//    res.render("chat");
//})

// server
const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


// importamos el modelo del chat
const MessageModel = require("./models/message.model.js");
// instancia socket.io (server)
const io = socket(httpServer);

const ProductManager = require("./controllers/product.manager.js");
const productManager = new ProductManager("./src/models/products.json");

// escuchamos el evento connection (PRODUCTS)
io.on("connection", async (socket) => {
    console.log("New client connected. (products)");

    //productos en tiempo real

    //el servidor envía los productos al cliente
    socket.emit("products", await productManager.getProducts());

    //el servidor escucha cuando el cliente elimina un producto
    socket.on("deleteProduct", async (id) => {
        //console.log("Product deleted with ID:", id);
        await productManager.deleteProduct(id);
        console.log("Deleting product with ID:", id);
    });
    // el servidor emite los productos actualizados a todos los clientes
    io.emit("products", await productManager.getProducts());
    // el servidor envía los productos actualizados al cliente
    //socket.emit("products", await productManager.getProducts());
    
    //el servidor escucha cuando el cliente agrega un producto
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        // el servidor envía los productos actualizados al cliente
        socket.emit("products", await productManager.getProducts());
    });

})

// establecemos la conexión (CHAT)
io.on("connection", (socket) => {
    console.log("New user connected. (chat)");

    //messages
    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        let messages = await MessageModel.find().lean();
        console.log(messages);
        io.emit("messagesLogs", messages);
    })

})

