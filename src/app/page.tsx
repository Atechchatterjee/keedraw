"use client";
import DrawBoardNav from "@/components/DrawBoardNav";
import { Textarea } from "@/components/ui/textarea";
import { useComboKeyPress, useKeyPress } from "@/context/useKey";
import { DIR, GraphMapId, GraphNode, MODE } from "@/lib/type";
import { cn, generateGraphIds } from "@/lib/utils";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { createContext } from "react";

// represents each box as a node in the graph
const InsertModeContext = createContext<{
  setMode: React.Dispatch<React.SetStateAction<MODE>>;
  boxList: Map<GraphMapId, GraphNode>;
  setBoxList: React.Dispatch<React.SetStateAction<Map<GraphMapId, GraphNode>>>;
  currentFocusedBox: GraphNode | undefined;
  setCurrentFocusedBox: React.Dispatch<
    React.SetStateAction<GraphNode | undefined>
  >;
}>({
  setMode: () => {},
  boxList: new Map(),
  setBoxList: () => {},
  currentFocusedBox: undefined,
  setCurrentFocusedBox: () => {},
});

function InsertMode() {
  const {
    boxList,
    setBoxList,
    setMode,
    currentFocusedBox,
    setCurrentFocusedBox,
  } = useContext(InsertModeContext);
  const [acceptInput, setAcceptInput] = useState<boolean>(false);
  const [x, setX] = useState<number>(870);
  const [y, setY] = useState<number>(470);
  const inputRef = useRef<any>(null);

  function displayInputBox() {
    if (inputRef.current) {
      console.log({ inputRef: inputRef.current });
      inputRef.current.focus();
      console.log("making input not hiddent");
      inputRef.current.hidden = false;
    }
  }

  // gets the direction of the newly created box w.r.t currently focused box
  function getDirection(): DIR {
    // normailising the newly created box according w.r.t the currently focused box
    if (currentFocusedBox) {
      const normalizedX = x - currentFocusedBox.x,
        normalizedY = -(y - currentFocusedBox.y);

      if (normalizedX === 0 && normalizedY > 0) return "t";
      else if (normalizedX < 0 && normalizedY > 0) return "tl";
      else if (normalizedX > 0 && normalizedY > 0) return "tl";
      else if (normalizedX === 0 && normalizedY < 0) return "b";
      else if (normalizedX < 0 && normalizedY < 0) return "bl";
      else if (normalizedX > 0 && normalizedY < 0) return "br";
      else if (normalizedX > 0 && normalizedY === 0) return "r";
      else if (normalizedX < 0 && normalizedY === 0) return "l";
      else return "";
    }
    return "";
  }

  // adds a child graph node to a given box
  function addChild(box: GraphNode, newChild: [DIR, GraphMapId]): GraphNode {
    let modifiedFocusedBoxAdj = new Map(box.adj);
    modifiedFocusedBoxAdj.set(newChild[0], newChild[1]);
    let modifiedFocusedBox: GraphNode = {
      ...box,
      adj: modifiedFocusedBoxAdj,
    };
    return modifiedFocusedBox;
  }

  function createGraphMapIdFromNode(graphNode: GraphNode): GraphMapId {
    return `${graphNode.x},${graphNode.y}_${graphNode.id}`;
  }

  function getOppositeDir(dir: DIR): DIR {
    switch (dir) {
      case "t":
        return "b";
      case "b":
        return "t";
      case "l":
        return "r";
      case "r":
        return "l";
      case "tl":
        return "br";
      case "tr":
        return "bl";
      case "bl":
        return "tr";
      case "br":
        return "tl";
    }
    return "";
  }

  function handleCreateBox(inputTextValue: string) {
    const direction = getDirection();
    console.log({ direction });
    if (direction !== "" || boxList.size === 0) {
      const newGraphId = generateGraphIds();
      const newGraphMapId: GraphMapId = `${x},${y}_${newGraphId}`;
      const newBoxAdj = new Map<DIR, GraphMapId>();
      // adds the current focused box (it's assumed parent) as its adj
      if (currentFocusedBox) {
        newBoxAdj.set(
          getOppositeDir(direction),
          createGraphMapIdFromNode(currentFocusedBox)
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
          let modifiedFocusedBox = addChild(currentFocusedBox, [
            direction,
            newGraphMapId,
          ]);
          setCurrentFocusedBox(modifiedFocusedBox);
          prevBoxList.set(
            `${currentFocusedBox.x},${currentFocusedBox.y}_${currentFocusedBox.id}`,
            modifiedFocusedBox
          );
        }
        // adding the newly created box to the box list
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
    // resetting the input
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
    // displayInputBox();
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
  const [normalModeMovement, setNormalModeMovement] = useState<
    "j" | "k" | "l" | "h" | ""
  >("");

  useKeyPress("i", function ChangeToInsertMode({ down }) {
    if (down) setMode("insert");
  });

  useEffect(() => {
    if (normalModeMovement !== "") {
      switch (normalModeMovement) {
        case "j":
          console.log("acutally moving down");
          const graphMapIdBottom: GraphMapId | undefined =
            currentFocusedBox?.adj.get("b");
          if (graphMapIdBottom) {
            const box = boxList.get(graphMapIdBottom);
            if (box) setCurrentFocusedBox(box);
          }
          setNormalModeMovement("");
          break;
        case "k":
          const graphMapIdTop: GraphMapId | undefined =
            currentFocusedBox?.adj.get("t");
          if (graphMapIdTop) {
            const box = boxList.get(graphMapIdTop);
            if (box) setCurrentFocusedBox(box);
          }
          setNormalModeMovement("");
          break;
        case "l":
          const graphMapIdRight: GraphMapId | undefined =
            currentFocusedBox?.adj.get("r");
          if (graphMapIdRight) {
            const box = boxList.get(graphMapIdRight);
            if (box) setCurrentFocusedBox(box);
          }
          setNormalModeMovement("");
          break;
        case "h":
          const graphMapIdLeft: GraphMapId | undefined =
            currentFocusedBox?.adj.get("l");
          if (graphMapIdLeft) {
            const box = boxList.get(graphMapIdLeft);
            if (box) setCurrentFocusedBox(box);
          }
          setNormalModeMovement("");
          break;
      }
    }
  }, [normalModeMovement, currentFocusedBox, boxList]);

  useKeyPress("j", function moveCurrentFocusedBox({ down }) {
    if (down) {
      console.log("normal mode movement j");
      setNormalModeMovement("j");
    }
  });

  useKeyPress("k", function moveCurrentFocusedBox({ down }) {
    if (down) {
      console.log("normal mode movement k");
      setNormalModeMovement("k");
    }
  });

  useKeyPress("l", function moveCurrentFocusedBox({ down }) {
    if (down) {
      console.log("normal mode movement l");
      setNormalModeMovement("l");
    }
  });

  useKeyPress("h", function moveCurrentFocusedBox({ down }) {
    if (down) {
      console.log("normal mode movement h");
      setNormalModeMovement("h");
    }
  });

  return <></>;
}

export default function Home() {
  const [mode, setMode] = useState<MODE>("insert");
  const [currentFocusedBox, setCurrentFocusedBox] = useState<GraphNode>();

  const [boxList, setBoxList] = useState<Map<GraphMapId, GraphNode>>(new Map());

  useEffect(() => {
    console.log({ boxList });
  }, [boxList]);

  function handleBoxClick(box: GraphNode) {
    setCurrentFocusedBox(box);
  }

  return (
    <main className="w-full h-[100vh]">
      <div className="h-[100vh] w-full dark:bg-black bg-background  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <div className="absolute pointer-events-none flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <DrawBoardNav className="absolute top-4 mx-auto" mode={mode} />
        <InsertModeContext.Provider
          value={{
            setMode,
            boxList,
            setBoxList,
            currentFocusedBox,
            setCurrentFocusedBox: (currentFocusedBoxCb) => {
              console.log({ currentFocusedBoxCb });
              setCurrentFocusedBox(currentFocusedBoxCb);
            },
          }}
        >
          {mode === "insert" && <InsertMode />}
        </InsertModeContext.Provider>
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
