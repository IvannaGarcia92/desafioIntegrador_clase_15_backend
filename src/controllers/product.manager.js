const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct({title, description, price, img, code, stock, category, thumbnails}) {
        try {
            if(!title|| !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios.");
                return; 
            }

            const productExist = await ProductModel.findOne({code: code});

            if(productExist) {
                console.log("Inserte un código unico.");
                return;
            }

            const newProduct = new ProductModel({
                title, 
                description, 
                price, 
                img, 
                code,
                stock, 
                category, 
                status: true, 
                thumbnails: thumbnails || []
            });

            await newProduct.save(); 

        } catch (error) {
            console.log("Error al agregar un producto.", error); 
            throw error; 
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find().lean(); 
            return products;
        } catch (error) {
            console.log("No es posible obtener los productos.", error); 
            throw error; 
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if(!product) {
                console.log("Producto no enontrado.");
                return null; 
            }
            console.log("Producto encontrado");
            return product;

        } catch (error) {
            console.log("No es posible encontrar el producto con ese ID.", error); 
            throw error; 
        }
    }

    async updateProduct(id, productUpdated) {
        try {
            const updateProduct =  await ProductModel.findByIdAndUpdate(id, productUpdated);

            if(!updateProduct) {
                console.log("No es posible encontrar el producto.");
                return null; 
            }
            console.log("Producto actualizado correctamente.");
            return updateProduct;

        } catch (error) {
            console.log("No es posible actualizar el producto con ese ID.", error); 
            throw error; 
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);

            if(!deleteProduct) {
                console.log("No es posible encontrar el producto.");
                return null; 
            }
            console.log("Producto eliminado correctamente.");
            
        } catch (error) {
            console.log("No pudimos eliminar el producto con ese ID.", error); 
            throw error; 
        }
    }
}

module.exports = ProductManager;