"use client";

import React from "react";
import { SendMessage } from "./message-send";
import { MessageList } from "./message-list";
import { ConnectControl } from "./connection-control";
import { useWebsocketConnection } from "./connection-websocket-io";

export default function Home() {
  const {
    connect,
    disconnect,
    send,
    isConnected,
    isConnecting,
    messages,
    errors,
  } = useWebsocketConnection();

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-center font-[family-name:var(--font-arial)] text-3xl">
          NextJS/AWS Websocket demo
        </h1>
        <div>
          <p className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
            Click{" "}
            <span className="rounded-md border border-indigo-600 font-semibold">
              WS Connect
            </span>{" "}
            button to connect to the websocket.
          </p>
          <div className="list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left">
            <p>
              You can test with the security token whether access is allowed or
              denied. The only token allowed is: <b>123</b>
            </p>
            <p>
              When connected, send messages to the backend, or open a new bash
              terminal and run script `sendmessages.sh`
              <br />
              and start receiving messages.
            </p>
          </div>

          <ConnectControl
            props={{ connect, disconnect, isConnected, isConnecting, errors }}
          />

          <SendMessage props={{ send, isConnected }} />

          <fieldset className="rounded-lg border border-black p-4">
            <legend className="p-2">Messages</legend>
            <ol className="m-1 w-full list-inside list-decimal">
              <MessageList list={messages} />
            </ol>
          </fieldset>
        </div>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
        Hire me:
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.upwork.com/freelancers/frankj11?viewMode=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upwork
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.toptal.com/resume/frank-joppe"
          target="_blank"
          rel="noopener noreferrer"
        >
          Toptal
        </a>
      </footer>
    </div>
  );
}
