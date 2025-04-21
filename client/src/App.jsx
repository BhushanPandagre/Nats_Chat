// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:3001");

// function App() {
//   const [room, setRoom] = useState("general");
//   const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.emit("join-room", room);

//     socket.on("chat-message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off("chat-message");
//     };
//   }, [room]);

//   const sendMessage = () => {
//     if (input.trim() !== "") {
//       socket.emit("chat-message", { room, username, text: input });
//       setInput("");
//     }
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: "sans-serif" }}>
//       <h2>💬 NATS Chat</h2>

//       <div style={{ marginBottom: 10 }}>
//         <input
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <select onChange={(e) => setRoom(e.target.value)} value={room}>
//           <option value="general">General</option>
//           <option value="tech">Tech</option>
//           <option value="random">Random</option>
//         </select>
//       </div>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: 10,
//           height: 300,
//           overflowY: "scroll",
//           marginBottom: 10
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div key={idx}>{msg}</div>
//         ))}
//       </div>

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message"
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         style={{ width: "80%", marginRight: 10 }}
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default App;



// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// const socket = io("http://localhost:3001");

// function App() {
//   const [room, setRoom] = useState("general");
//   const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     socket.emit("join-room", room);

//     socket.on("chat-message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.off("chat-message");
//     };
//   }, [room]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (input.trim() !== "") {
//       socket.emit("chat-message", { room, username, text: input });
//       setInput("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-2xl font-bold mb-4 text-center">💬 NATS Chat</h2>

//         <div className="flex gap-2 mb-4">
//           <input
//             className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//           />
//           <select
//             className="border rounded px-2 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
//             onChange={(e) => setRoom(e.target.value)}
//             value={room}
//           >
//             <option value="general">General</option>
//             <option value="tech">Tech</option>
//             <option value="random">Random</option>
//           </select>
//         </div>

//         <div className="border rounded h-72 overflow-y-auto p-3 bg-gray-50 text-sm mb-4 space-y-2">
//           {messages.map((msg, idx) => (
//             <div key={idx} className="text-gray-800">{msg}</div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>

//         <div className="flex gap-2">
//           <input
//             className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message"
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("general");
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join-room", room);

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, [room]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("chat-message", { room, username, text: input });
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="text-3xl font-extrabold text-center text-indigo-600">💬 NATS Chat</h2>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <select
            className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setRoom(e.target.value)}
            value={room}
          >
            <option value="general">General</option>
            <option value="tech">Tech</option>
            <option value="random">Random</option>
          </select>
        </div>

        <div className="border border-gray-300 rounded-lg h-80 overflow-y-auto p-3 bg-gray-50 text-sm space-y-2 shadow-inner">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-indigo-100 text-indigo-900 px-3 py-2 rounded-xl w-fit max-w-[85%] shadow-md"
            >
              {msg}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
