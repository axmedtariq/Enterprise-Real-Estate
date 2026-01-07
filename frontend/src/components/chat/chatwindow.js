// frontend/src/components/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function ChatWindow({ currentUser, receiver }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const handleSend = () => {
    socket.current.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: receiver.id,
      text: newMessage,
    });
    setMessages([...messages, { senderId: currentUser.id, text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 h-[500px] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white" />
        <div>
          <p className="font-bold text-sm">Agent: {receiver.name}</p>
          <p className="text-[10px] opacity-80">Typically replies in 5 mins</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question..." 
          className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-xl">Send</button>
      </div>
    </div>
  );
}