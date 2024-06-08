"use client";
import { Input } from "@/components/ui/input";
import { useComboKeyPress } from "@/context/useKey";
import { useState, useEffect, useRef } from "react";

interface BoxType {
  text: string;
  x: number;
  y: number;
}

export default function Home() {
  const [createBoxKeyPress, setCreateBoxKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "n",
  });
  const [createBoxDownKeyPress, setCreateBoxDownKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "j",
  });
  const [createBoxUpKeyPress, setCreateBoxUpKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "k",
  });
  const [createBoxLeftKeyPress, setCreateBoxLeftKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "h",
  });
  const [createBoxRightKeyPress, setCreateBoxRightKeyPress] = useComboKeyPress({
    mod: "Alt",
    key: "l",
  });

  const [createBoxTextInput, setCreateBoxTextInput] = useState<string>("");
  const [createBoxTrigger, setCreateBoxTrigger] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [boxList, setBoxList] = useState<BoxType[]>([]);

  const [x, setX] = useState<number>(200);
  const [y, setY] = useState<number>(500);

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
      <Input
        ref={inputRef}
        className={
          !createBoxKeyPress ? "hidden" : "absolute z-[10000] w-[20rem]"
        }
        style={{ top: `${x}px`, left: `${y}px` }}
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
            className="absolute w-[20rem] border border-slate-600 rounded-md p-4"
            style={{ top: `${box.x}px`, left: `${box.y}px` }}
          >
            <p>{box.text}</p>
          </div>
        );
      })}
    </main>
  );
}
