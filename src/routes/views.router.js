const express = require("express");
const router = express.Router(); 

const ProductManager = require("../controllers/product.manager.js");
const productManager = new ProductManager();
//"./src/models/products.json"

//ver todos los productos en el home
router.get("/",  async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", {productos:products});
    } catch (error) {
        res.status(500).json({error: "Error interno del servidor"})
    }
})

//ver todos los productos en tiempo real
router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
})

//ver el chat en el home
router.get("/", async (req, res) => { 
    res.render("chat");
})

module.exports = router; 