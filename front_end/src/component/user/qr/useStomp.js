import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import {Client, Stomp} from "@stomp/stompjs";

/**
 * useStomp({url, topic, onMessage})
 * url: e.g. "http://localhost:8080/ws" (backend STOMP endpoint)
 * topic: e.g. "/topic/booking-updates"
 * onMessage: fn(msg)
 */
export function useStomp({ url, topic, onMessage }) {
    const clientRef = useRef(null);

    useEffect(() => {
        if (!url || !topic) return;

        const sock = new SockJS(url);
        const client = Stomp.over(sock);
        client.debug = () => {}; // disable logs
        client.connect({}, () => {
            client.subscribe(topic, (payload) => {
                try {
                    const body = JSON.parse(payload.body);
                    onMessage(body);
                } catch (e) {
                    console.warn("Invalid WS payload", e);
                }
            });
        }, (err) => {
            console.warn("STOMP connect error", err);
        });

        clientRef.current = client;

        return () => {
            try {
                clientRef.current.disconnect();
            } catch (e) {}
        };
    }, [url, topic, onMessage]);
}
