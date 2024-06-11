"use client";
import DrawBoardNav from "@/components/DrawBoardNav";
import { Input } from "@/components/ui/input";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { MODE } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useContext } from "react";
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
  mode: MODE;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  x: number;
  y: number;
  setX: React.Dispatch<React.SetStateAction<number>>;
  setY: React.Dispatch<React.SetStateAction<number>>;
  boxList: BoxType[];
  setBoxList: React.Dispatch<React.SetStateAction<BoxType[]>>;
  setCurrentFocusedBox: React.Dispatch<
    React.SetStateAction<BoxType | undefined>
  >;
}>({
  mode: "normal",
  setMode: () => { },
  x: 750,
  y: 400,
  setX: () => { },
  setY: () => { },
  boxList: [],
  setBoxList: () => { },
  setCurrentFocusedBox: () => { },
});

function InsertMode() {
  const {
    x,
    y,
    setX,
    setY,
    boxList,
    setBoxList,
    mode,
    setMode,
    setCurrentFocusedBox,
  } = useContext(InsertModeContext);

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
        setY(y + offset);
        break;
      case "up":
        setY(y - offset);
        break;
      case "left":
        setX(x - offset);
        break;
      case "right":
        setX(x + offset);
    }
    setCreateBoxKeyPress(true);
  };

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
    <>
      {boxList.length === 0 && !createBoxKeyPress &&
        <div className="flex gap-3 p-4 border border-slate-300 rounded-lg">
          Press<p className="font-bold text-slate-600">Alt + n</p>
        </div>
      }
      <Input
        ref={inputRef}
        className={
          !createBoxKeyPress
            ? "hidden"
            : "bg-transparent text-md absolute z-[10000] w-[20rem] border-none outline-none border-transparent focus-visible:ring-transparent"
        }
        style={{ top: `${y}px`, left: `${x}px`, outline: "none" }}
        placeholder="Start typing"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setCreateBoxTextInput((e as any).target.value);
            setCreateBoxTrigger(true);
          }
        }}
        autoFocus={createBoxKeyPress}
      />
    </>
  );
}

export default function Home() {
  const [mode, setMode] = useState<MODE>("insert");
  const [currentFocusedBox, setCurrentFocusedBox] = useState<BoxType>();

  const [insertModeKeyPress, setInsertModeKeyPress] = useKeyPress("i");

  const [boxList, setBoxList] = useState<BoxType[]>([]);

  const [x, setX] = useState<number>(750);
  const [y, setY] = useState<number>(400);

  useEffect(() => {
    if (insertModeKeyPress) {
      setMode("insert");
      setInsertModeKeyPress(false);
    }
  }, [insertModeKeyPress]);

  return (
    <main className="w-full h-[100vh]">
      <div className="h-[100vh] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <DrawBoardNav className="absolute top-4 mx-auto" mode={mode} />
        <InsertModeContext.Provider
          value={{
            mode,
            setMode,
            boxList,
            setBoxList,
            setCurrentFocusedBox,
            x,
            y,
            setX,
            setY,
          }}
        >
          {mode === "insert" && <InsertMode />}
        </InsertModeContext.Provider>
        {boxList.length === 0 && mode === "normal" &&
          <div className="flex gap-5 p-4 border border-slate-300 rounded-lg">
            Press<strong className="text-slate-600">i</strong>
          </div>
        }
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
            >
              <p>{box.text}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
