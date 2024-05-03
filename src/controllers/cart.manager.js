const CartModel = require("../models/cart.model.js");

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart .save();
            return newCart ;
        } catch (error) {
            console.log("No es posible crear un nuevo carrito.", error);
            throw error; 
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if(!cart) {
                console.log("No es posible encontrar un carrito con ese ID.");
                return null; 
            }
            
            return cart;

        } catch (error) {
            console.log("No pudimos encontrar un carrito con ese ID.", error);
            throw error; 
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(item => item.product.toString() === productId);

            if(productExist) {
                productExist.quantity += quantity; 
            }else {
                cart.products.push({product: productId, quantity});
            }

            //Es posible marcar la propiedad "products" como modificada: 
            //cart.markModified("products");

            await cart.save();
            return cart;
            
        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error; 
        }
    }

    async getAllCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.log("No es posible obtener todos los carritos.", error);
            throw error;
        }
    }

    async deleteCartById(cartId) {
        try {
            await CartModel.findByIdAndDelete(cartId);
        } catch (error) {
            console.log("No es posible eliminar el carrito con ese ID.", error);
            throw error;
        }
    }
}

module.exports = CartManager;