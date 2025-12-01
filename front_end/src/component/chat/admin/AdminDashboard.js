// AdminDashboard.jsx - PHIÊN BẢN HOÀN CHỈNH & HOẠT ĐỘNG REALTIME 2 CHIỀU
import React, { useEffect, useState, useRef } from "react";
import {
    getConversations,
    getHistory,
    sendAsAdmin,
    markConversationRead
} from "../../../service/chat/chatBoxApi";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import AdminChatPanel from "./AdminChatPanel";
import "./AdminDashboard.css";

const WS_URL = "http://localhost:8080/ws";
const BASE_URL = "http://localhost:8080";

export default function AdminDashboard({ currentAdmin }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null); // Lưu subscription hiện tại

    const getUserAvatar = (u) =>
        u?.avatar ? `${BASE_URL}${u.avatar}` : "/default-avatar.png";

    // Tải danh sách cuộc trò chuyện
    useEffect(() => {
        loadConversations();
        connectWebSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, []);

    // Kết nối WebSocket một lần duy nhất
    const connectWebSocket = () => {
        const token = localStorage.getItem("token");
        const socket = new SockJS(WS_URL);

        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log("STOMP: ", str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Admin WebSocket connected");

            // 1. Luôn lắng nghe danh sách conversation mới/cập nhật
            client.subscribe("/topic/support.conversations", () => {
                loadConversations(); // Refresh danh sách khi có tin nhắn mới
            });

            // 2. Nếu đang mở 1 cuộc chat → subscribe realtime cho user đó
            if (selectedConv?.user?.id) {
                subscribeToUserChat(selectedConv.user.id);
            }
        };

        client.activate();
        stompClientRef.current = client;
    };

    // Tải danh sách hội thoại
    const loadConversations = () => {
        getConversations()
            .then((list) => {
                setConversations(list || []);
            })
            .catch((err) => console.error("Lỗi load conversations:", err));
    };

    // Hàm subscribe vào chat của 1 user cụ thể (dựa trên userId)
    const subscribeToUserChat = (userId) => {
        if (!stompClientRef.current?.connected) return;

        // Hủy subscription cũ trước khi tạo mới
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }

        const sub = stompClientRef.current.subscribe(
            `/topic/support.conversation.${userId}`,
            (message) => {
                const newMsg = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMsg]);
            }
        );

        subscriptionRef.current = sub;
    };

    // Mở cuộc trò chuyện
    const openConversation = async (conv) => {
        if (!conv?.user?.id) return;

        setSelectedConv(conv);
        setMessages([]); // Reset tin nhắn

        try {
            const history = await getHistory(conv.user.id);
            setMessages(history || []);
        } catch (err) {
            console.error("Lỗi load lịch sử:", err);
        }

        try {
            await markConversationRead(conv.id);
            setConversations(prev =>
                prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
            );
        } catch (err) {
            console.error("Lỗi mark read:", err);
        }

        // Subscribe realtime cho user này
        subscribeToUserChat(conv.user.id);
    };

    // Gửi tin nhắn từ admin
    const onSendAsAdmin = (text) => {
        if (!text.trim() || !selectedConv?.user?.id) return;

        const payload = {
            userId: selectedConv.user.id,
            content: text.trim(),
        };

        sendAsAdmin(payload)
            .then(() => {
                // Không cần thêm tin nhắn vào UI → WebSocket sẽ tự đẩy về cả 2 bên
                console.log("Tin nhắn admin đã gửi thành công");
            })
            .catch((err) => {
                console.error("Gửi tin nhắn thất bại:", err.response?.data || err);
                alert("Gửi tin nhắn thất bại!");
            });
    };

    return (
        <div className="admin-dashboard">
            {/* Danh sách người dùng đang chat */}
            <div className="conv-list">
                <h3 className="text-xl font-bold mb-4">Hộp thư hỗ trợ</h3>
                {conversations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Chưa có tin nhắn nào</p>
                ) : (
                    <ul>
                        {conversations.map((c) => (
                            <li
                                key={c.id}
                                className={`conv-item ${selectedConv?.id === c.id ? "active" : ""}`}
                                onClick={() => openConversation(c)}
                            >
                                <img className="avatar" src={getUserAvatar(c.user)} alt="avatar" />
                                <div className="conv-meta">
                                    <div className="conv-user font-medium">
                                        {c.user?.name || c.user?.username || "Người dùng"}
                                    </div>
                                    <div className="conv-last text-sm text-gray-600 truncate">
                                        {c.lastMessage?.content || "Bắt đầu trò chuyện..."}
                                    </div>
                                </div>
                                {c.unreadCount > 0 && (
                                    <div className="unread-badge">{c.unreadCount}</div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Panel chat */}
            <div className="conv-panel">
                {selectedConv ? (
                    <AdminChatPanel
                        conversation={selectedConv}
                        messages={messages}
                        onSend={onSendAsAdmin}
                    />
                ) : (
                    <div className="empty-panel">
                        <div className="text-center text-gray-500 mt-20">
                            <p className="text-2xl mb-4">Chào mừng Admin!</p>
                            <p>Chọn một người dùng để bắt đầu hỗ trợ</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}