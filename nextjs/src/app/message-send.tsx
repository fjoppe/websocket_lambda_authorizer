"use client";

import { clsx } from "clsx";
import React, { useState } from "react";

export function SendMessage({
  props: { send, isConnected },
}: {
  props: { send: (m: string) => void; isConnected: boolean };
}) {
  const [message, setMessage] = useState("");
  const isWebsocketReady = () => isConnected;

  function onChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    setMessage(e.currentTarget.value);
  }

  function onClickSend(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    send(message);
    setMessage("");
  }

  return (
    <fieldset
      className={clsx({
        "rounded-lg": true,
        border: true,
        "border-black": true,
        "bg-gray-200": !isWebsocketReady(),
        "p-4": true,
        "opacity-30": !isWebsocketReady(),
      })}
    >
      <legend className="p-1">Send message to backend</legend>
      <div className="m-1 w-full list-inside list-decimal">
        <label className="block">Message:</label>
        <div className="inline">
          <input
            className="w-4/5 rounded-md border-2 border-gray-500 p-2 focus:border-blue-700 focus:outline-none"
            disabled={!isWebsocketReady()}
            type="text"
            placeholder={"type something here"}
            value={message}
            onChange={onChange}
          />
          <button
            className="m-4 rounded bg-blue-500 px-2 py-1 font-bold text-white enabled:hover:bg-blue-700"
            disabled={!isWebsocketReady()}
            onClick={onClickSend}
          >
            Send
          </button>
        </div>
      </div>
    </fieldset>
  );
}
