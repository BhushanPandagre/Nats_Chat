

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const { connect, StringCodec } = require("nats");
// const mongoose = require("mongoose");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// mongoose.connect("mongodb://localhost:27017/nats-chat", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }).then(() => console.log("✅ MongoDB Connected"));

// (async () => {
//   const nats = await connect({ servers: "localhost:4222" });
//   const sc = StringCodec();

//   io.on("connection", (socket) => {
//     console.log("🟢 A user connected");

//     let activeSub = null; // store the current subscription per socket

//     socket.on("join-room", async (room) => {
//       socket.join(room);
//       console.log(`🔗 User joined room: ${room}`);

//       // Unsubscribe from previous room to prevent duplication
//       if (activeSub) {
//         activeSub.unsubscribe();
//         activeSub = null;
//       }

//       // Subscribe to the new room
//       activeSub = nats.subscribe(`chat.room.${room}`);
//       (async () => {
//         for await (const msg of activeSub) {
//           const text = sc.decode(msg.data);
//           io.to(room).emit("chat-message", text);
//         }
//       })();
//     });

//     socket.on("chat-message", ({ room, username, text }) => {
//       const msg = `[${room}] [${username}]: ${text}`;
//       nats.publish(`chat.room.${room}`, sc.encode(msg));
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 A user disconnected");
//       if (activeSub) activeSub.unsubscribe();
//     });
//   });

//   server.listen(3001, () => {
//     console.log("🚀 Server running on http://localhost:3001");
//   });
// })();


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connect, StringCodec } = require("nats");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// MongoDB schema
const messageSchema = new mongoose.Schema({
  room: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/nats-chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// NATS connection
(async () => {
  try {
    const nats = await connect({ servers: "localhost:4222" });
    const sc = StringCodec();

    io.on("connection", (socket) => {
      console.log("🟢 A user connected");

      let activeSub = null; // store the current subscription per socket

      socket.on("join-room", async (room) => {
        socket.join(room);
        console.log(`🔗 User joined room: ${room}`);

        // Unsubscribe from previous room to prevent duplication
        if (activeSub) {
          activeSub.unsubscribe();
          activeSub = null;
        }

        // Subscribe to the new room
        activeSub = nats.subscribe(`chat.room.${room}`);
        (async () => {
          for await (const msg of activeSub) {
            const text = sc.decode(msg.data);
            io.to(room).emit("chat-message", text);
          }
        })();
      });

      socket.on("chat-message", async ({ room, username, text }) => {
        // Save message to MongoDB
        const msg = new Message({ room, username, text });
        await msg.save(); // Save the message

        // Publish to NATS
        const formattedMessage = `[${room}] [${username}]: ${text}`;
        nats.publish(`chat.room.${room}`, sc.encode(formattedMessage));
      });

      socket.on("disconnect", () => {
        console.log("🔴 A user disconnected");
        if (activeSub) activeSub.unsubscribe();
      });
    });

    server.listen(3001, () => {
      console.log("🚀 Server running on http://localhost:3001");
    });

  } catch (err) {
    console.error("Failed to connect to NATS:", err);
  }
})();
