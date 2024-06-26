const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product.manager.js");
const productManager = new ProductManager();

//1) Listar todos los productos. 
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("No es posible obtener los productos.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

//2) Traer solo un producto por id: 

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({
                error: "Producto no encontrado."
            });
        }

        res.json(product);
    } catch (error) {
        console.error("No es posible obtener el producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});


//3) Agregar nuevo producto: 

router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado exitosamente."
        });
    } catch (error) {
        console.error("No es posible agregar el producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

//4) Actualizar por ID
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updateProduct = req.body;

    try {
        await productManager.updateProduct(id, updateProduct);
        res.json({
            message: "Producto actualizado exitosamente."
        });
    } catch (error) {
        console.error("No es posible actualizar el producto.", error);
        res.status(500).json({
            error: "Error interno del servidor."
        });
    }
});

//5) Eliminar producto: 

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    console.log("Received request to delete product with ID:", id); 

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente."
        });
    } catch (error) {
        console.error("No es posible eliminar el producto.", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;