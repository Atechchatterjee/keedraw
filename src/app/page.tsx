"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { useState, useEffect, useRef } from "react";

interface BoxType {
  text: string;
  x: number;
  y: number;
}

type MODE = "normal" | "editing";

export default function Home() {
  const [mode, setMode] = useState<MODE>("normal");

  const [createBoxKeyPress, setCreateBoxKeyPress] = useComboKeyPress("Alt+n");
  const [createBoxDownKeyPress, setCreateBoxDownKeyPress] =
    useComboKeyPress("Alt+j");
  const [createBoxUpKeyPress, setCreateBoxUpKeyPress] =
    useComboKeyPress("Alt+k");
  const [createBoxLeftKeyPress, setCreateBoxLeftKeyPress] =
    useComboKeyPress("Alt+h");
  const [createBoxRightKeyPress, setCreateBoxRightKeyPress] =
    useComboKeyPress("Alt+l");

  const [escapeKeyPress, setEscapeKeyPress] = useKeyPress("Escape");

  const [createBoxTextInput, setCreateBoxTextInput] = useState<string>("");
  const [createBoxTrigger, setCreateBoxTrigger] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [boxList, setBoxList] = useState<BoxType[]>([]);

  const [x, setX] = useState<number>(400);
  const [y, setY] = useState<number>(750);

  useEffect(() => {
    if (escapeKeyPress) {
      setCreateBoxKeyPress(false);
      setCreateBoxTrigger(false);
      setCreateBoxTextInput("");
      setEscapeKeyPress(false);
      inputRef.current.value = "";
    }
  }, [escapeKeyPress]);

  useEffect(() => {
    if (createBoxKeyPress) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.hidden = false;
      }
    }
  }, [createBoxKeyPress]);

  useEffect(() => {
    if (createBoxTrigger) {
      setBoxList((currentBoxList) => [
        ...currentBoxList,
        { y: y, x: x, text: createBoxTextInput },
      ]);
      setCreateBoxKeyPress(false);
      setCreateBoxTrigger(false);
      setCreateBoxTextInput("");
      inputRef.current.value = "";
    }
  }, [createBoxTrigger]);

  useEffect(() => {
    if (createBoxDownKeyPress) {
      setX(x + 100);
      setCreateBoxKeyPress(true);
      setCreateBoxDownKeyPress(false);
    } else if (createBoxUpKeyPress) {
      setX(x - 100);
      setCreateBoxKeyPress(true);
      setCreateBoxUpKeyPress(false);
    } else if (createBoxLeftKeyPress) {
      setY(y - 400);
      setCreateBoxKeyPress(true);
      setCreateBoxLeftKeyPress(false);
    } else if (createBoxRightKeyPress) {
      setY(y + 400);
      setCreateBoxKeyPress(true);
      setCreateBoxRightKeyPress(false);
    }
  }, [
    createBoxDownKeyPress,
    createBoxUpKeyPress,
    createBoxLeftKeyPress,
    createBoxRightKeyPress,
  ]);

  return (
    <main className="w-full h-100vh">
      <Textarea
        ref={inputRef}
        className={
          !createBoxKeyPress
            ? "hidden"
            : "text-md absolute z-[10000] w-[20rem] border-0 outline-0 border-transparent focus-visible:ring-transparent"
        }
        style={{ top: `${x}px`, left: `${y}px`, outline: "none" }}
        placeholder="Start typing"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setCreateBoxTextInput((e as any).target.value);
            setCreateBoxTrigger(true);
          }
        }}
        autoFocus={createBoxKeyPress}
      />
      {boxList.map((box) => {
        console.log({ x: box.x, y: box.y, text: box.text });
        return (
          <div
            className="absolute w-[20rem] border border-slate-400 rounded-md p-4 bg-slate-100"
            style={{ top: `${box.x}px`, left: `${box.y}px` }}
          >
            <p>{box.text}</p>
          </div>
        );
      })}
    </main>
  );
}
