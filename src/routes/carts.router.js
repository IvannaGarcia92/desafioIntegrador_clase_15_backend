const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart.manager.js");
const cartManager = new CartManager();


// Creamos un nuevo carrito

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("No es posible crear un nuevo carrito.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// ruta donde listamos todos los carritos
router.get("/", async (req, res) => {
    try {
        const allCarts = await cartManager.getAllCarts();
        res.json(allCarts);
    } catch (error) {
        console.error("No es posible obtener los carritos.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});


// Listamos los productos que pertenecen a determinado carrito

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid.toString();

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("No es posible obtener el carrito con ese ID.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});


// Agregamos productos a distintos carritos

router.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid.toString();
    const productId = req.params.pid.toString();
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("No es posible agregar productos al carrito.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// Eliminar un carrito por su ID
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid.toString();

    try {
        await cartManager.deleteCartById(cartId);
        res.json({ message: "Carrito eliminado correctamente." });
    } catch (error) {
        console.error("No es posible eliminar el carrito.", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports = router;