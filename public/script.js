
const socket = io();
console.log("📡 Conectado ao servidor...");

const welcomeMessage = document.getElementById('welcomeMessage');
const avatar = document.getElementById('avatar');
const username = document.getElementById('username');
const chatBox = document.getElementById('chatBox');

socket.on('newUser', (data) => {
    console.log("👤 Novo usuário detectado:", data);

    if (data && data.username) {
        avatar.src = data.avatar || 'https://via.placeholder.com/50'; 
        username.textContent = `Bem-vindo(a), ${data.username}!`; 
        welcomeMessage.classList.remove('hidden'); 
        
        setTimeout(() => {
            welcomeMessage.classList.add('hidden');
        }, 5000);
    } else {
        console.error("Erro: Dados do usuário estão incompletos ou ausentes.");
    }
});


socket.on('newMessage', (data) => {
    console.log("💬 Nova mensagem detectada:", data);

    if (data && data.username && data.message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-item');
        messageElement.innerHTML = `
            <img src="${data.avatar || 'https://via.placeholder.com/50'}" alt="${data.username}" width="30" height="30">
            <strong>${data.username}:</strong> ${data.message}
        `;
        chatBox.appendChild(messageElement);

       
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        console.error("Erro: Mensagem recebida sem dados completos.");
    }
});
