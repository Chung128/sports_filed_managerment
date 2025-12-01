// import React, { useEffect, useState, useRef } from "react";
// import { sendMessage, getHistory } from "../../../service/chat/chatBoxApi";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import "./ChatWidget.css";
// import { BsMessenger } from "react-icons/bs";
// import { getCurrentUser } from "../../../service/user/login/authApi";
//
// const WS_URL = "http://localhost:8080/ws";
//
// export default function ChatWidget() {
//     const [open, setOpen] = useState(false);
//     const [user, setUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [text, setText] = useState("");
//     const stompRef = useRef(null);
//     const bottomRef = useRef(null);
//     const token = localStorage.getItem("token");
//
//     useEffect(() => {
//         if (bottomRef.current) {
//             bottomRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     }, [messages]);
//
//     /** Load user + history + connect WebSocket */
//     useEffect(() => {
//         getCurrentUser()
//             .then((u) => {
//                 setUser(u);
//                 loadHistory(u.id);
//                 connectSocket(u.id);
//             })
//             .catch(() => {
//                 console.warn("User chưa đăng nhập hoặc API '/auth/me' không tồn tại");
//             });
//
//         return () => {
//             if (stompRef.current) stompRef.current.deactivate();
//         };
//     }, []);
//
//     // Nếu chưa đăng nhập -> không hiển thị gì hết
//     if (!token) return null;
//
//     /** Lấy lịch sử chat */
//     function loadHistory(userId) {
//         getHistory(userId).then((res) => setMessages(res));
//     }
//
//     /** Kết nối WebSocket + gửi token */
//     function connectSocket(userId) {
//         const token = localStorage.getItem("token");
//
//         const client = new Client({
//             webSocketFactory: () => new SockJS(WS_URL),  // ← SỬA ĐÚNG ENDPOINT "/ws"
//             connectHeaders: {
//                 Authorization: `Bearer ${token}`,
//             },
//             debug: (str) => {
//                 console.log("STOMP USER: ", str);  // ← THÊM DEBUG ĐỂ KIỂM TRA CONNECT
//             },
//             onConnect: () => {
//                 console.log("User WebSocket connected!");  // ← DEBUG CONNECT THÀNH CÔNG
//                 client.subscribe(`/topic/support.conversation.${userId}`, (msg) => {
//                     const body = JSON.parse(msg.body);
//                     console.log("USER NHẬN ĐƯỢC REALTIME:", body);
//                     setMessages((prev) => {
//                         // Kiểm tra nếu message đã tồn tại (dựa trên id) để tránh duplicate
//                         if (prev.some(m => m.id === body.id)) {
//                             return prev;
//                         }
//                         return [...prev, body];
//                     });
//                 });
//             },
//             onStompError: (frame) => {
//                 console.error("STOMP Error:", frame);  // ← DEBUG NẾU CONNECT THẤT BẠI
//             },
//         });
//
//         client.activate();
//         stompRef.current = client;
//     }
//
//     /** Gửi tin nhắn */
//     function handleSend() {
//         if (!text.trim() || !user) return;
//
//         const payload = {
//             userId: user.id,
//             senderId: user.id,
//             content: text,
//         };
//
//         sendMessage(payload).then(() => {
//             setText(""); // Chỉ clear text, không thêm message thủ công → dựa vào WebSocket
//         }).catch(err => console.error("Gửi thất bại:", err));
//     }
//
//     return (
//         <>
//             <div className="chat-button" onClick={() => setOpen(!open)}>
//                 {!open && <BsMessenger className="chat-icon" size={30} />}
//             </div>
//
//             {open && (
//                 <div className="chat-box">
//                     <div className="chat-header">
//                         <strong>Trung tâm hỗ trợ khách hàng</strong>
//                         <button className="close-btn" onClick={() => setOpen(false)}>
//                             ✕
//                         </button>
//                     </div>
//
//                     <div className="chat-body">
//                         {messages.map((m) => (
//                             <div
//                                 key={m.id}  // Sử dụng m.id làm key để tránh duplicate render
//                                 className={
//                                     m.sender?.id === user?.id
//                                         ? "message message-user"
//                                         : "message message-admin"
//                                 }
//                             >
//                                 <div className="msg-content">{m.content}</div>
//                             </div>
//                         ))}
//
//                         <div ref={bottomRef}></div>
//                     </div>
//
//                     <div className="chat-input">
//                         <input
//                             type="text"
//                             placeholder="Nhập tin nhắn..."
//                             value={text}
//                             onChange={(e) => setText(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                         />
//                         <button onClick={handleSend}>Gửi</button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
import React, { useEffect, useState, useRef } from "react";
import { sendMessage, getHistory, markConversationRead } from "../../../service/chat/chatBoxApi"; // Giả sử thêm markAsRead từ service
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./ChatWidget.css";
import { BsMessenger } from "react-icons/bs";
import { getCurrentUser } from "../../../service/user/login/authApi";

// WebSocket endpoint: ĐÃ SỬA ĐÚNG LÀ "/ws" (KHÔNG CÓ "/chat" + KHÔNG CẦN ?token vì token qua header)
const WS_URL = "http://localhost:8080/ws";
const PAGE_SIZE = 15;

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [conversationId, setConversationId] = useState(null); // Lưu conversationId từ messages
    const stompRef = useRef(null);
    const bottomRef = useRef(null);
    const chatBodyRef = useRef(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    /** Load user + history + connect WebSocket */
    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                setUser(u);
                loadHistory(u.id, 0); // Load trang đầu tiên
                connectSocket(u.id);
            })
            .catch(() => {
                console.warn("User chưa đăng nhập hoặc API '/auth/me' không tồn tại");
            });

        return () => {
            if (stompRef.current) stompRef.current.deactivate();
        };
    }, []);

    /** Xử lý khi mở chat: mark read + reset unread */
    useEffect(() => {
        if (open && conversationId && token) {
            markConversationRead(conversationId); // Gọi API mark as read (giả sử service có, với isAdmin=false)
            setUnreadCount(0);
        }
    }, [open, conversationId, token]);

    // Nếu chưa đăng nhập -> không hiển thị gì hết
    if (!token) return null;

    /** Lấy lịch sử chat với pagination */
    async function loadHistory(userId, currentPage) {
        try {
            const res = await getHistory(userId, currentPage, PAGE_SIZE); // Giả sử service hỗ trợ page, size
            if (res.length < PAGE_SIZE) {
                setHasMore(false);
            }
            setMessages((prev) => [...res.reverse(), ...prev]); // Prepend (thêm vào đầu) để tin cũ ở trên
            if (res.length > 0 && !conversationId) {
                setConversationId(res[0].conversation?.id); // Lấy conversationId từ message đầu tiên
            }
        } catch (err) {
            console.error("Lỗi load history:", err);
        }
    }

    /** Kết nối WebSocket + gửi token */
    function connectSocket(userId) {
        const token = localStorage.getItem("token");

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log("STOMP USER: ", str);
            },
            onConnect: () => {
                console.log("User WebSocket connected!");
                client.subscribe(`/topic/support.conversation.${userId}`, (msg) => {
                    const body = JSON.parse(msg.body);
                    console.log("USER NHẬN ĐƯỢC REALTIME:", body);
                    setMessages((prev) => {
                        // Kiểm tra duplicate
                        if (prev.some(m => m.id === body.id)) {
                            return prev;
                        }
                        return [...prev, body];
                    });

                    // Nếu chat đóng và tin từ admin, tăng unread
                    if (!open && body.sender?.role === "ADMIN") {
                        setUnreadCount((prev) => prev + 1);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame);
            },
        });

        client.activate();
        stompRef.current = client;
    }

    /** Gửi tin nhắn */
    function handleSend() {
        if (!text.trim() || !user) return;

        const payload = {
            userId: user.id,
            senderId: user.id,
            content: text,
        };

        sendMessage(payload).then(() => {
            setText(""); // Chỉ clear text, dựa vào WebSocket để thêm message
        }).catch(err => console.error("Gửi thất bại:", err));
    }

    /** Load more tin nhắn cũ khi ấn nút */
    const loadMore = () => {
        if (hasMore && user) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadHistory(user.id, nextPage);
        }
    };

    return (
        <>
            <div className="chat-button relative" onClick={() => setOpen(!open)}>
                {!open && <BsMessenger className="chat-icon" size={30} />}
                {unreadCount > 0 && !open && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                        {unreadCount}
                    </div>
                )}
            </div>

            {open && (
                <div className="chat-box">
                    <div className="chat-header">
                        <strong>Hỗ trợ khách hàng</strong>
                        <button className="close-btn" onClick={() => setOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="chat-body" ref={chatBodyRef}>
                        {hasMore && (
                            <div className="load-more text-center py-2">
                                <button onClick={loadMore} className="text-blue-500">
                                    ↑ Xem thêm tin nhắn cũ
                                </button>
                            </div>
                        )}
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={
                                    m.sender?.id === user?.id
                                        ? "message message-user"
                                        : "message message-admin"
                                }
                            >
                                <div className="msg-content">{m.content}</div>
                            </div>
                        ))}
                        <div ref={bottomRef}></div>
                    </div>

                    <div className="chat-input">
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
            )}
        </>
    );
}