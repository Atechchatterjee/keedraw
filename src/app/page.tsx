"use client";
import DrawBoardNav from "@/components/DrawBoardNav";
import { Input } from "@/components/ui/input";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { MODE } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useState, useRef, useContext } from "react";
import { createContext } from "react";

interface BoxType {
  id: number;
  text: string;
  x: number;
  y: number;
}

// represents each box as a node in the graph
interface BoxGraphNode {
  id: number;
  x: number;
  y: number;
  length: number;
  root?: boolean;
  parentId?: number;
}

const InsertModeContext = createContext<{
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  boxList: BoxType[];
  setBoxList: React.Dispatch<React.SetStateAction<BoxType[]>>;
  setCurrentFocusedBox: React.Dispatch<
    React.SetStateAction<BoxType | undefined>
  >;
}>({
  setMode: () => {},
  boxList: [],
  setBoxList: () => {},
  setCurrentFocusedBox: () => {},
});

function InsertMode() {
  const { boxList, setBoxList, setMode, setCurrentFocusedBox } =
    useContext(InsertModeContext);
  const [acceptInput, setAcceptInput] = useState<boolean>(false);
  const [x, setX] = useState<number>(750);
  const [y, setY] = useState<number>(400);
  const inputRef = useRef<any>(null);

  const displayInputBox = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      console.log("making input not hiddent");
      inputRef.current.hidden = false;
    }
  };

  const getLastBoxListId = () =>
    boxList.length === 0 ? 0 : boxList[boxList.length - 1].id;

  const handleCreateBox = (inputTextValue: string) => {
    const newBox: BoxType = {
      id: getLastBoxListId() + 1,
      y: y,
      x: x,
      text: inputTextValue,
    };
    setBoxList((currentBoxList) => [...currentBoxList, newBox]);
    // setting the newly created box as the current focused block
    setCurrentFocusedBox(newBox);
    dismissInputBox();
  };

  const dismissInputBox = () => {
    setAcceptInput(false);
    // resetting the input
    if (inputRef.current) inputRef.current.value = "";
  };

  const moveBox = (
    movement: "up" | "down" | "right" | "left",
    offset: number
  ) => {
    switch (movement) {
      case "down":
        setY((prevY) => prevY + offset);
        break;
      case "up":
        setY((prevY) => prevY - offset);
        break;
      case "left":
        setX((prevX) => prevX - offset);
        break;
      case "right":
        setX((prevX) => prevX + offset);
    }
    setAcceptInput(true);
  };

  useKeyPress("Escape", ({ down }) => {
    if (down) {
      dismissInputBox();
      setMode("normal");
    }
  });

  useComboKeyPress("Alt+n", function showInput() {
    displayInputBox();
    setAcceptInput(true);
  });

  useComboKeyPress("Alt+j", function moveDown() {
    console.log("moving down");
    moveBox("down", 100);
  });

  useComboKeyPress("Alt+k", function moveUp() {
    moveBox("up", 100);
  });

  useComboKeyPress("Alt+h", function moveLeft() {
    moveBox("left", 400);
  });

  useComboKeyPress("Alt+l", function moveRight() {
    moveBox("right", 400);
  });

  return (
    <>
      {boxList.length === 0 && !acceptInput && (
        <div className="flex gap-3 p-4 border border-slate-300 rounded-lg">
          Press<p className="font-bold text-slate-600">Alt + n</p>
        </div>
      )}
      {acceptInput && (
        <Input
          ref={inputRef}
          className="bg-transparent text-md absolute z-[10000] w-[20rem] border-none outline-none border-transparent focus-visible:ring-transparent"
          style={{ top: `${y}px`, left: `${x}px`, outline: "none" }}
          placeholder="Start typing"
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              const textValue = e.target.value;
              handleCreateBox(textValue);
            }
          }}
          autoFocus={true}
        />
      )}
    </>
  );
}

export default function Home() {
  const [mode, setMode] = useState<MODE>("insert");
  const [currentFocusedBox, setCurrentFocusedBox] = useState<BoxType>();

  const [boxList, setBoxList] = useState<BoxType[]>([]);

  useKeyPress("i", ({ down }) => {
    if (down) {
      setMode("insert");
    }
  });

  return (
    <main className="w-full h-[100vh]">
      <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <DrawBoardNav className="absolute top-4 mx-auto" mode={mode} />
        <InsertModeContext.Provider
          value={{
            setMode,
            boxList,
            setBoxList,
            setCurrentFocusedBox,
          }}
        >
          {mode === "insert" && <InsertMode />}
        </InsertModeContext.Provider>
        {boxList.length === 0 && mode === "normal" && (
          <div className="flex gap-5 p-4 border border-slate-300 rounded-lg">
            Press<strong className="text-slate-600">i</strong>
          </div>
        )}
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
              style={{ top: `${box.y}px`, left: `${box.x}px` }}
              key={i}
              onClick={() => {
                setCurrentFocusedBox(box);
              }}
            >
              <p>{box.text}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
