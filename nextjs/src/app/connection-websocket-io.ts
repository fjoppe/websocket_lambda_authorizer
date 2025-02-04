import { useState, useEffect } from "react";
import { MessageType } from "./model";

const initialMessage = {
  type: "init",
  data: "hard coded test message - not received from websocket!",
} satisfies MessageType;

export function useWebsocketConnection() {
  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  const [errors, setErrors] = useState<string[]>([]);
  const [wsUrl, setWsUrl] = useState(process.env.NEXT_PUBLIC_wsEndpoint);
  const [ws, setWS] = useState<WebSocket | undefined>();
  const [isConnected, setConnected] = useState(false);
  const [isConnecting, setConnecting] = useState(false);

  useEffect(() => {
    console.log(`ws: ${ws}, wsUrl: ${wsUrl}`);
  }, [ws, wsUrl]);

  //    see: https://stackoverflow.com/a/28396165/4653407
  function errorCodeToString(event: Event) {
    switch (event.code) {
      case 1000:
        return "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
      case 1001:
        return 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
      case 1002:
        return "An endpoint is terminating the connection due to a protocol error";
      case 1003:
        return "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
      case 1004:
        return "Reserved. The specific meaning might be defined in the future.";
      case 1005:
        return "No status code was actually present.";
      case 1006:
        return "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
      case 1007:
        return "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
      case 1008:
        return 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
      case 1009:
        return "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
      case 1010: // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
        return (
          "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
          event.reason
        );
      case 1011:
        return "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
      case 1015:
        return "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
      default:
        return "Unknown reason";
    }
  }

  function connect(url: string, token: string) {
    setWsUrl(url);
    setConnecting(true);
    setErrors([]);
    const openWS = new WebSocket(`${wsUrl}?token=${token}`);
    openWS.onopen = () => {
      setConnected(true);
      console.log("WS Opened");
      setMessages([initialMessage]);
      setConnecting(false);
    };
    openWS.onclose = (e: Event) => {
      console.log("WS Closed");
      setWS(undefined);
      setConnected(false);
      setConnecting(false);
      if (e.code !== 1000 && e.code !== 1005) {
        const msg = errorCodeToString(e);
        setErrors((prev) => [...prev, msg]);
      }
    };
    openWS.onerror = (e: Event) => {
      console.log(e);
      setConnecting(false);
      setErrors((prev) => [...prev, "Error in WebSocket"]);
    };
    openWS.onmessage = (e: MessageEvent) => {
      console.log(`message: ${JSON.stringify(e)}/${e.data}`);
      setMessages((m) => [...m, JSON.parse(e.data)]);
    };
    setWS(openWS);
    console.log(`Connecting to websocket: ${wsUrl}`);
  }

  function disconnect() {
    if (ws) {
      ws.close();
      setWS(undefined);
    }
  }

  function send(message: string) {
    if (ws) {
      ws.send(message);
    }
  }

  return {
    connect,
    disconnect,
    send,
    isConnected,
    isConnecting,
    messages,
    errors,
  };
}
