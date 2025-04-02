import express from "express";
const app=express();

import {createServer} from "http"
import {Server}from "socket.io"
import cors from "cors"
const myHttpServer=createServer(app);

const io=new Server(myHttpServer,{cors:{
    origin:["http://localhost:5173"],
    methods:["GET","POST"]
}})

io.on("connection",(socket)=>{
    const{userId}=socket.handshake.query
    console.log("socket connected: "+socket.id)
    console.log(userId)

    socket.on("joinRoom",(roomId)=>{
        socket.join(roomId)
        console.log( "user joined room:"+roomId)
    })

 
    socket.on("leaveRoom",(roomId)=>{
        socket.leave(roomId)
        console.log( "user left room:"+roomId)
    })



    socket.on("disconnect",()=>{
        console.log("socket disconnected: "+socket.id)
    })
})

export {myHttpServer,io,app}