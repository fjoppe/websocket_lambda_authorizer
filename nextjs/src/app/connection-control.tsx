"use client";

import React, { useState } from "react";

export function ConnectControl({
  props: { connect, disconnect, isConnecting, isConnected, errors },
}: {
  props: {
    connect: (u: string, t: string) => void;
    disconnect: () => void;
    isConnecting: boolean;
    isConnected: boolean;
    errors: string[];
  };
}) {
  const [wsUrl, setWsUrl] = useState(process.env.NEXT_PUBLIC_wsEndpoint);
  const [token, setToken] = useState("123");

  function onChangeUrl(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    setWsUrl(e.currentTarget.value);
  }

  function onChangeToken(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    setToken(e.currentTarget.value);
  }
  function onClickConnect(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (wsUrl) {
      connect(wsUrl, token);
    }
  }

  function onClickDisconnect(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    disconnect();
  }

  function displayErrors() {
    if (errors && errors.length > 0) {
      return (
        <ol>
          {errors.map((e, i) => (
            <li className="m-1 rounded bg-red-700 text-white" key={i}>
              {e}
            </li>
          ))}
        </ol>
      );
    } else {
      return <></>;
    }
  }
  return (
    <fieldset className="rounded-lg border border-black p-4">
      <legend className="p-2">Connection</legend>
      {!isConnecting && !isConnected && (
        <>
          <p>
            <button
              className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
              onClick={onClickConnect}
            >
              WS Connect
            </button>
          </p>
          <p>
            <label className="px-2">WS connection Url:</label>
            <input
              value={wsUrl}
              onChange={onChangeUrl}
              className="w-full rounded-md border-2 border-gray-500 p-2 focus:border-blue-700 focus:outline-none"
            />
          </p>
          <p>
            <label className="px-2">Security token:</label>
            <input
              value={token}
              onChange={onChangeToken}
              className="w-full rounded-md border-2 border-gray-500 p-2 focus:border-blue-700 focus:outline-none"
            />
          </p>
        </>
      )}
      {(isConnecting || isConnected) && (
        <p>
          {isConnecting && <span className="bg-yellow-200">Connecting</span>}
          {isConnected && <span className="bg-green-300">Connected</span>}
          &nbsp;to: {wsUrl} with token: {token}
          <br />
          <button
            className="rounded bg-blue-500 px-2 py-1 font-bold text-white enabled:hover:bg-blue-700"
            onClick={onClickDisconnect}
            disabled={!isConnected}
          >
            WS Disconnect
          </button>
        </p>
      )}
      {displayErrors()}
    </fieldset>
  );
}
