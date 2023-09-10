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
        console.log("user joined the room:", roomId, peerId);
      if(rooms[roomId])
      {
        rooms[roomId].push(peerId)
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", {peerId})
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        })
        
      }
        socket.on('disconnect',()=>{
            console.log('user left the room', peerId)
            leaveRoom({roomId, peerId})
        })
    }

    const leaveRoom =({ peerId, roomId})=>{
        rooms[roomId] = rooms[roomId]?.filter((id)=>id !== peerId);
        socket.to(roomId).emit('user-disconneted', peerId)
    }
    const startSharing =({peerId, roomId})=>{
        socket.to(roomId).emit("user-started-sharing", peerId)
    }
    const stopSharing =(roomId)=>{
        socket.to(roomId).emit("user-stopped-sharing")
    }
    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
    socket.on("start-sharing",startSharing);
    socket.on("stop-sharing", stopSharing);
};

module.exports =roomHandler;