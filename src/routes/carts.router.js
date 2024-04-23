const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart.manager.js");
const cartManager = new CartManager();


//1) Creamos un nuevo carrito: 

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("No es posible crear un nuevo carrito.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

//2) Listamos los productos que pertenecen a determinado carrito. 

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("No es posible obtener el carrito con ese ID.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});


//3) Agregar productos a distintos carritos.

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("No es posible agregar productos al carrito.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;