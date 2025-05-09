const { TikTokLiveConnection } = require('tiktok-live-connector');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;
const tiktokUsername = 'aj.hobbys'; // Substitua pelo seu nome de usuário

app.use(express.static(path.join(__dirname, 'public')));


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

let connection;
try {
    connection = new TikTokLiveConnection(tiktokUsername);
    console.log(`✅ Conexão com ${tiktokUsername} criada com sucesso.`);
} catch (error) {
    console.error(`❌ Falha ao criar conexão: ${error.message}`);
    process.exit(1); 
}


connection.on('roomUser', (data) => {
    console.log("🔍 Dados recebidos do evento roomUser:");
    console.log(JSON.stringify(data, null, 2));
  

});



connection.on('member', (data) => {
    console.log("👁️ Novo visualizador detectado:");
    console.log(JSON.stringify(data, null, 2));
   const username = data.user?.nickname || 'Usuário Anônimo';
    const avatar = data.user?.profilePicture?.urls[0] || 'https://via.placeholder.com/150'; 


        console.log(`- ${data.nickname} entrou na Live`);
        io.emit('newUser', {
            username: username,
            avatar: avatar
           
        });
   
});


connection.on('chat', (data) => {
    console.log(`💬 Mensagem recebida:`, JSON.stringify(data, null, 2));

    // Verifica se os dados do usuário existem, caso contrário, define um valor padrão
    const username = data.user?.nickname || 'Usuário Anônimo';
    const avatar = data.user?.profilePicture?.urls[0] || 'https://via.placeholder.com/150'; 
    const message = data.comment || '[Mensagem não disponível]';

    console.log(`💬 Mensagem recebida de ${username}: ${message}`);

    io.emit('newMessage', {
        username: username,
        message: message,
        avatar: avatar
    });
});



connection.connect().then(() => {
    console.log(`✅ Aguardando live de ${tiktokUsername} iniciar...`);
}).catch((err) => {
    console.error('❌ Erro ao conectar:', err.message);
});

//node server.js  --- para iniciar o server.