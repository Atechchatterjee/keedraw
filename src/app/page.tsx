"use client";
import DrawBoardNav from "@/components/DrawBoardNav";
import { Textarea } from "@/components/ui/textarea";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import {
  addEdge,
  createGraphMapId,
  getOppositeDir,
  getRelativeDirection,
} from "@/lib/graph";
import { DIR, GraphMapId, GraphNode, MODE } from "@/lib/type";
import { cn } from "@/lib/utils";
import { generateGraphIds } from "@/lib/graph";
import { useState, useRef } from "react";

function InsertMode({
  setMode,
  boxList,
  setBoxList,
  currentFocusedBox,
  setCurrentFocusedBox,
}: {
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  boxList: Map<GraphMapId, GraphNode>;
  setBoxList: React.Dispatch<React.SetStateAction<Map<GraphMapId, GraphNode>>>;
  currentFocusedBox: GraphNode | undefined;
  setCurrentFocusedBox: React.Dispatch<
    React.SetStateAction<GraphNode | undefined>
  >;
}) {
  const [acceptInput, setAcceptInput] = useState<boolean>(false);
  const [x, setX] = useState<number>(870);
  const [y, setY] = useState<number>(470);
  const inputRef = useRef<any>(null);

  function displayInputBox() {
    if (inputRef.current) {
      console.log({ inputRef: inputRef.current });
      inputRef.current.focus();
      console.log("making input not hidden");
      inputRef.current.hidden = false;
    }
  }

  function handleCreateBox(inputTextValue: string) {
    const direction = getRelativeDirection({ x, y }, currentFocusedBox);
    if (direction !== "" || boxList.size === 0) {
      const newGraphId = generateGraphIds();
      const newGraphMapId: GraphMapId = createGraphMapId({
        x,
        y,
        id: newGraphId,
      });
      const newBoxAdj = new Map<DIR, GraphMapId>();
      // adds the current focused box (it's assumed parent) as its adj
      if (currentFocusedBox) {
        newBoxAdj.set(
          getOppositeDir(direction),
          createGraphMapId(currentFocusedBox)
        );
      }
      const newBox: GraphNode = {
        id: newGraphId,
        y: y,
        x: x,
        text: inputTextValue,
        length: 200,
        parentId: currentFocusedBox?.id ?? "",
        adj: newBoxAdj,
        dir: direction,
      };
      setBoxList((prevBoxList) => {
        // adding the newly created box as a child of it's parent (currentFocusedBox)
        if (currentFocusedBox) {
          let modifiedFocusedBox = addEdge(currentFocusedBox, newBox);
          setCurrentFocusedBox(modifiedFocusedBox);
          prevBoxList.set(
            `${currentFocusedBox.x},${currentFocusedBox.y}_${currentFocusedBox.id}`,
            modifiedFocusedBox
          );
        }
        // adding the newly created node to the box list
        prevBoxList.set(newGraphMapId, newBox);
        return new Map(prevBoxList);
      });
      if (boxList.size === 1) {
        setCurrentFocusedBox(newBox);
      }
      dismissInputBox();
    }
  }

  function dismissInputBox() {
    setAcceptInput(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function moveBox(movement: "up" | "down" | "right" | "left", offset: number) {
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
  }

  useKeyPress("Escape", function EscapeInsertMode({ down }) {
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
      {boxList.size === 0 && !acceptInput && (
        <div className="flex gap-3 p-4 border border-slate-300 rounded-lg">
          Press<p className="font-bold text-slate-600">Alt + n</p>
        </div>
      )}
      {acceptInput && (
        <Textarea
          ref={inputRef}
          className="bg-transparent text-md absolute z-[10000] w-[20rem] border-none outline-none border-transparent focus-visible:ring-transparent"
          style={{ top: `${y}px`, left: `${x}px`, outline: "none" }}
          placeholder="Start typing"
          onKeyDown={(e: any) => {
            if (e.key === "Enter") handleCreateBox(e.target.value);
          }}
          autoResize
          autoFocus
        />
      )}
    </>
  );
}

function NormalMode({
  currentFocusedBox,
  setCurrentFocusedBox,
  boxList,
  setBoxList,
  setMode,
}: {
  currentFocusedBox: GraphNode | undefined;
  setCurrentFocusedBox: React.Dispatch<
    React.SetStateAction<GraphNode | undefined>
  >;
  boxList: Map<GraphMapId, GraphNode>;
  setBoxList: React.Dispatch<React.SetStateAction<Map<GraphMapId, GraphNode>>>;
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
}) {
  useKeyPress("i", function ChangeToInsertMode({ down }) {
    if (down) setMode("insert");
  });

  function moveFocus(dir: DIR) {
    const graphMapId: GraphMapId | undefined = currentFocusedBox?.adj.get(dir);
    if (graphMapId) {
      const box = boxList.get(graphMapId);
      if (box) setCurrentFocusedBox(box);
    }
  }

  useKeyPress(
    "j",
    function moveCurrentFocusedBox({ down }) {
      if (down) {
        console.log("normal mode movement j");
        moveFocus("b");
      }
    },
    [currentFocusedBox, boxList]
  );

  useKeyPress(
    "k",
    function moveCurrentFocusedBox({ down }) {
      if (down) {
        moveFocus("t");
      }
    },
    [currentFocusedBox, boxList]
  );

  useKeyPress(
    "l",
    function moveCurrentFocusedBox({ down }) {
      if (down) {
        moveFocus("r");
      }
    },
    [currentFocusedBox, boxList]
  );

  useKeyPress(
    "h",
    function moveCurrentFocusedBox({ down }) {
      if (down) {
        moveFocus("l");
      }
    },
    [currentFocusedBox, boxList]
  );

  return <></>;
}

export default function Home() {
  const [mode, setMode] = useState<MODE>("insert");
  const [currentFocusedBox, setCurrentFocusedBox] = useState<GraphNode>();

  const [boxList, setBoxList] = useState<Map<GraphMapId, GraphNode>>(new Map());

  function handleBoxClick(box: GraphNode) {
    setCurrentFocusedBox(box);
  }

  return (
    <main className="w-full h-[100vh]">
      <div className="h-[100vh] w-full dark:bg-black bg-background  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <DrawBoardNav className="absolute top-4 mx-auto" mode={mode} />
        {mode === "insert" && (
          <InsertMode
            setMode={setMode}
            boxList={boxList}
            setBoxList={setBoxList}
            currentFocusedBox={currentFocusedBox}
            setCurrentFocusedBox={setCurrentFocusedBox}
          />
        )}
        {mode === "normal" && (
          <NormalMode
            currentFocusedBox={currentFocusedBox}
            setCurrentFocusedBox={setCurrentFocusedBox}
            boxList={boxList}
            setBoxList={setBoxList}
            setMode={setMode}
          />
        )}
        {boxList.size === 0 && mode === "normal" && (
          <div className="flex gap-5 p-4 border border-slate-300 rounded-lg">
            Press<strong className="text-slate-600">i</strong>
          </div>
        )}
        {Array.from(boxList).map(([key, box]) => (
          <div
            className={cn(
              "absolute w-[20rem] border border-slate-400 rounded-md p-4 bg-slate-100",
              currentFocusedBox && currentFocusedBox.id === box.id
                ? "outline outline-offset-1 outline-slate-600"
                : ""
            )}
            style={{ top: `${box.y}px`, left: `${box.x}px` }}
            key={key}
            onClick={() => handleBoxClick(box)}
          >
            <p>{box.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
