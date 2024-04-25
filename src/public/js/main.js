// client
const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})

//renderizamos la lista de productos 
const renderProducts = (products) => {
    const productsContainer = document.getElementById("productsContainer");
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

//// CHAT ////

//Creamos una variable para guardar el usuario: 
let user; 
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identify yourself",
    input: "text",
    text: "Enter your username to identify yourself in the chat",
    inputValidator: (value) => {
        return !value && "You need to enter a username to enter the chat room";
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})

//el cliente envia mensajes al servidor
chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

//Listener de Mensajes: 
//el servidor recibe los mensajes y los renderiza en pantalla
socket.on("messagesLogs", data => {
    let log = document.getElementById("messagesLogs");

    let messages = "";

    data.forEach( message => {
        const bgColorClass = message.user === user ? 'bg-primary' : 'bg-secondary';
        messages += `<li class="list-group-item ${bgColorClass}">${message.user} : ${message.message}</li>`;
    })

    log.innerHTML = messages;
})