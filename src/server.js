import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
console.log("Listening on http://localhost:4000");

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];
//소켓 - 연결된 브라우저와의 컨텍트 라인 
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명"
    console.log("Connected to Browser 🌟");
    socket.on("close", () => console.log("Disconnected from the Browser ✖️"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
});


server.listen(4000);