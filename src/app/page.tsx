"use client";
import { Input } from "@/components/ui/input";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<any>(null);
  const [createBoxKeyPress, setCreateBoxKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "n",
  });
  const [createBoxTextInput, setCreateBoxTextInput] = useState<string>("");
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (createBoxKeyPress) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.hidden = false;
      }
      if (createBoxTextInput !== "") {
        console.log("creating box");
        context.fillStyle = "#000000";
        context.strokeStyle = "#00000";
        context.rect(10, 10, context.canvas.width, context.canvas.height);
        context.font = "20px serif";
        context.fillText(createBoxTextInput, 80, 80);
        setCreateBoxKeyPress(false);
      }
    }
  }, [createBoxKeyPress, createBoxTextInput]);

  return (
    <main className="w-full h-100vh">
      <canvas ref={canvasRef} width="100%" height="100vh" />
      <Input
        ref={inputRef}
        className={
          !createBoxKeyPress
            ? "hidden"
            : "absolute top-[20rem] left-[25rem] w-[20rem]"
        }
        placeholder="Add Text ..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setCreateBoxTextInput((e as any).target.value);
          }
        }}
        autoFocus={createBoxKeyPress}
      />
    </main>
  );
}
