"use client";

import { clsx } from "clsx";
import React from "react";

import { MessageType } from "./model";

export function MessageList({ list }: { list: MessageType[] }) {
  function getClass(type: string) {
    switch (type) {
      case "init":
        return "bg-violet-200";
      case "echo":
        return "bg-blue-100";
      case "log":
        return "bg-amber-100";
      case "event":
        return "bg-teal-100";
    }
    return "";
  }
  return (
    <>
      {list.map((m, i) => {
        const msg = m;
        return (
          <li
            className={clsx(
              "m-1",
              "p-1",
              "font-mono",
              "rounded-md",
              getClass(msg.type),
            )}
            key={i}
          >
            {msg.data}
          </li>
        );
      })}
    </>
  );
}
