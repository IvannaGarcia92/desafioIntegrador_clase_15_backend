// client
const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})

//renderizamos la lista de productos 
const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
    console.log("Products container:", productsContainer);
    productsContainer.innerHTML = "";

    products.forEach (item => {
        const productCard = document.createElement("div");
        productCard.innerHTML = `
                                <p> ID: ${item.id} </p>
                                <p> Title: ${item.title} </p>
                                <p> Price: ${item.price} </p>
                                <button class="delete-product-btn" data-product-id="${item.id}"> Delete Product </button>
        `;

        productsContainer.appendChild(productCard);
        //evento del boton para eliminar producto
        productCard.querySelector(".delete-product-btn").addEventListener("click", () => {
            //const productId = item.id;
            //const productId = event.target.dataset.productId;
            const productId = item._id.toString();
            deleteProduct(productId);
            //deleteProduct(item.id)
        })
    })
}

// delete product
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

// add product
document.getElementById("btnAddProduct").addEventListener("click", () => {
    addProduct();
})

const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("addProduct", product);
}

