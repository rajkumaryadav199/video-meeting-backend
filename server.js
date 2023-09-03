const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require('socket.io');
const roomHandler  = require('./src/room/roomHandler');
app.use(cors);

const io =new Server(server, {
    cors:{
        origin: "*", // Replace with your React app's domain
        methods: ["GET","POST"],
    }
});    /* added new key  */

io.on('connection', (socket)=>{
    // console.debug('test', socket)
    // socket.emit('me', socket.id);
    roomHandler(socket)
    // socket.on('join-room', ()=>{
    //     console.log('joined meeting room')
    // })
    socket.on('disconnect', (socket)=>{
        // socket.broadcast.emit('callEnded')
        console.log('disconnect')
    })

    // socket.on('callUser', (data)=>{
    //     console.log('message', data)
    //     io.to(data.userToCall).emit('callUser',{signal:data.signalData, from:data.from, name:data.name})
    // })

    // socket.on('answerCall', (data)=>{
    //    io.to(data.to).emit("callAccepeted"), data.signal
    // })
})

server.listen(8080, ()=>{
    console.log('server is running at port 8080')
})
