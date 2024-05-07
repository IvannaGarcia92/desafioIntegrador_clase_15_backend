//// CHAT ////

// inciializamos socket
const socket = io();

// guardamos el usuario en una variable
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

// el cliente envia mensajes al servidor
chatBox.addEventListener("keyup", (event) => {
    console.log("Key pressed:", event.key);
    if(event.key === "Enter") {
        console.log("Enter key pressed");
        if(chatBox.value.trim().length > 0) {
            console.log("Chat message:", chatBox.value);
            //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
            //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
            socket.emit("message", {user: user, message: chatBox.value}); 
            chatBox.value = "";
        }
    }
})

// Listener de Mensajes: 
// el servidor recibe los mensajes y los renderiza en pantalla
socket.on("messagesLogs", data => {
    //console.log("Mensajes recibidos del servidor:", data);
    let log = document.getElementById("messagesLogs");
    console.log("Log container:", log);
    
    let messages = "";

    data.forEach( message => {
        const bgColorClass = message.user === user ? 'bg-primary' : 'bg-secondary';
        messages += `<li class="list-group-item ${bgColorClass}">${message.user} : ${message.message}</li>`;
    })

    log.innerHTML = messages;
})