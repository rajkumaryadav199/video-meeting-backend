const { Socket } = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const rooms={};

const roomHandler = (socket)=>{

    const createRoom=()=>{
        const roomId=uuidV4();
        rooms[roomId]=[];
        socket.emit("room-created", {roomId});
    }

    const joinRoom =({roomId, peerId})=>{
        console.log("joined room", roomId, peerId);
        rooms[roomId].push(peerId)
        socket.join(roomId);

        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        })
        
        socket.on('disconnect',()=>{
            console.log('user left the room', peerId)
            console.log({roomId, peerId})
        })
    }


    socket.on('create-room', createRoom)
    socket.on('join-room', joinRoom)
}

const leaveRoom =({roomId, peerId})=>{
    rooms[roomId] = rooms[roomsId].filter((id)=>id !== peerId);
    socket.to(roomId).emit('user-disconneted', peerId)
}
module.exports =roomHandler