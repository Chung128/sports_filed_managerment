// import React, { useEffect, useRef, useState } from "react";
// import "./AdminChatPanel.css";
//
// const BASE_URL = "http://localhost:8080";
//
// export default function AdminChatPanel({ conversation, messages = [], onSend }) {
//     const [text, setText] = useState("");
//     const [localMessages, setLocalMessages] = useState(messages || []);
//     const bottomRef = useRef(null);
//
//     useEffect(() => {
//         setLocalMessages(messages || []);
//     }, [messages]);
//
//     useEffect(() => {
//         if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
//     }, [localMessages]);
//
//     const getAvatar = (user) => user?.avatar ? `${BASE_URL}${user.avatar}` : "/default-avatar.png"; // Thêm fallback nếu avatar null
//
//     function handleSend() {
//         if (!text.trim()) return;
//         onSend(text);
//         setText("");
//     }
//
//     return (
//         <div className="admin-chat">
//             <div className="chat-top">
//                 <div className="chat-user">
//                     <img src={getAvatar(conversation.user)} alt="avatar" />
//                     <div>
//                         <div className="name">{conversation.user?.username || conversation.user?.name}</div>
//                         <div className="sub">User ID: {conversation.user?.id}</div>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="chat-messages">
//                 {localMessages.map((m, i) => (
//                     <div key={i} className={`chat-row ${m.sender?.role === "ADMIN" ? "from-admin" : "from-user"}`}>
//                         <img className="msg-avatar" src={getAvatar(m.sender)} alt="a" />
//                         <div className="msg-bubble">
//                             <div className="msg-text">{m.content}</div>
//                             <div className="msg-time">{new Date(m.createdAt).toLocaleString()}</div>
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={bottomRef} />
//             </div>
//
//             <div className="chat-controls">
//                 <input
//                     type="text"
//                     placeholder="Nhập tin nhắn..."
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 />
//                 <button onClick={handleSend}>Gửi</button>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useRef, useState } from "react";
import "./AdminChatPanel.css";

const BASE_URL = "http://localhost:8080";

export default function AdminChatPanel({ conversation, messages = [], onSend }) {
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    // Auto scroll xuống cuối khi messages thay đổi (WebSocket nhận message mới)
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const getAvatar = (user) =>
        user?.avatar ? `${BASE_URL}${user.avatar}` : "/default-avatar.png";

    function handleSend() {
        if (!text.trim()) return;

        onSend(text);  // ← GỬI CHO SERVER, KHÔNG TỰ ADD MESSAGE TRONG UI
        setText("");
    }

    return (
        <div className="admin-chat">
            <div className="chat-top">
                <div className="chat-user">
                    <img src={getAvatar(conversation.user)} alt="avatar" />
                    <div>
                        <div className="name">
                            {conversation.user?.username || conversation.user?.name}
                        </div>
                        <div className="sub">User ID: {conversation.user?.id}</div>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((m, i) => (
                    <div
                        key={m.id || i}
                        className={`chat-row ${
                            m.sender?.role === "ADMIN" ? "from-admin" : "from-user"
                        }`}
                    >
                        <img className="msg-avatar" src={getAvatar(m.sender)} alt="avatar" />
                        <div className="msg-bubble">
                            <div className="msg-text">{m.content}</div>
                            <div className="msg-time">
                                {new Date(m.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="chat-controls">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
}
