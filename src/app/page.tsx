"use client";
import DrawBoardNav from "@/components/DrawBoardNav";
import { Input } from "@/components/ui/input";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { MODE } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface BoxType {
  id: number;
  text: string;
  x: number;
  y: number;
}

export default function Home() {
  const [mode, setMode] = useState<MODE>("normal");
  const [currentFocusedBox, setCurrentFocusedBox] = useState<BoxType>();

  const [insertModeKeyPress, setInsertModeKeyPress] = useKeyPress(
    "i",
    mode,
    "normal"
  );

  const [createBoxKeyPress, setCreateBoxKeyPress] = useComboKeyPress(
    "Alt+n",
    mode,
    "insert"
  );
  const [createBoxDownKeyPress, setCreateBoxDownKeyPress] = useComboKeyPress(
    "Alt+j",
    mode,
    "insert"
  );
  const [createBoxUpKeyPress, setCreateBoxUpKeyPress] = useComboKeyPress(
    "Alt+k",
    mode,
    "insert"
  );
  const [createBoxLeftKeyPress, setCreateBoxLeftKeyPress] = useComboKeyPress(
    "Alt+h",
    mode,
    "insert"
  );
  const [createBoxRightKeyPress, setCreateBoxRightKeyPress] = useComboKeyPress(
    "Alt+l",
    mode,
    "insert"
  );

  const [escapeKeyPress, setEscapeKeyPress] = useKeyPress(
    "Escape",
    mode,
    "insert"
  );

  const [createBoxTextInput, setCreateBoxTextInput] = useState<string>("");
  const [createBoxTrigger, setCreateBoxTrigger] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [boxList, setBoxList] = useState<BoxType[]>([]);

  const [x, setX] = useState<number>(400);
  const [y, setY] = useState<number>(750);

  const displayInputBox = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.hidden = false;
    }
  };

  const getLastBoxListId = () =>
    boxList.length === 0 ? 0 : boxList[boxList.length - 1].id;

  const handleCreateBox = () => {
    const newBox: BoxType = {
      id: getLastBoxListId() + 1,
      y: y,
      x: x,
      text: createBoxTextInput,
    };
    setBoxList((currentBoxList) => [...currentBoxList, newBox]);
    // setting the newly created box as the current focused block
    setCurrentFocusedBox(newBox);
    dismissInputBox();
  };

  const dismissInputBox = () => {
    setCreateBoxKeyPress(false);
    setCreateBoxTrigger(false);
    setCreateBoxTextInput("");
    setEscapeKeyPress(false);
    inputRef.current.value = "";
  };

  const moveBox = (
    movement: "up" | "down" | "right" | "left",
    offset: number
  ) => {
    switch (movement) {
      case "down":
        setX(x + offset);
        break;
      case "up":
        setX(x - offset);
        break;
      case "left":
        setY(y - offset);
        break;
      case "right":
        setY(y + offset);
    }
    setCreateBoxKeyPress(true);
  };

  useEffect(() => {
    if (insertModeKeyPress) {
      setMode("insert");
      setInsertModeKeyPress(false);
    }
  }, [insertModeKeyPress]);

  useEffect(() => {
    if (escapeKeyPress) {
      dismissInputBox();
      setMode("normal");
    }
  }, [escapeKeyPress]);

  useEffect(() => {
    if (createBoxKeyPress) displayInputBox();
  }, [createBoxKeyPress]);

  useEffect(() => {
    if (createBoxTrigger) handleCreateBox();
  }, [createBoxTrigger]);

  useEffect(() => {
    if (createBoxDownKeyPress) {
      moveBox("down", 100);
      setCreateBoxDownKeyPress(false);
    } else if (createBoxUpKeyPress) {
      moveBox("up", 100);
      setCreateBoxUpKeyPress(false);
    } else if (createBoxLeftKeyPress) {
      moveBox("left", 400);
      setCreateBoxLeftKeyPress(false);
    } else if (createBoxRightKeyPress) {
      moveBox("right", 400);
      setCreateBoxRightKeyPress(false);
    }
  }, [
    mode,
    createBoxDownKeyPress,
    createBoxUpKeyPress,
    createBoxLeftKeyPress,
    createBoxRightKeyPress,
  ]);

  return (
    <main className="w-full h-[100vh]">
      <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <DrawBoardNav className="absolute top-4 mx-auto" mode={mode} />
        <Input
          ref={inputRef}
          className={
            !createBoxKeyPress
              ? "hidden"
              : "bg-transparent text-md absolute z-[10000] w-[20rem] border-none outline-none border-transparent focus-visible:ring-transparent"
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
        {boxList.map((box, i) => {
          console.log({ x: box.x, y: box.y, text: box.text });
          return (
            <div
              className={cn(
                "absolute w-[20rem] border border-slate-400 rounded-md p-4 bg-slate-100",
                currentFocusedBox && currentFocusedBox.id === box.id
                  ? "outline outline-offset-1 outline-slate-600"
                  : ""
              )}
              style={{ top: `${box.x}px`, left: `${box.y}px` }}
              key={i}
            >
              <p>{box.text}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
