import { MODE } from "@/lib/type";
import { useEffect, useState } from "react";

// (listening for target key) target key eg: h
export const useKeyPress = (
  targetKey: string
): [boolean, (val: boolean) => void] => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) setKeyPressed(true);
  };

  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return [keyPressed, setKeyPressed];
};

// (listening for target key) target key eg: "Alt+h"
export const useComboKeyPress = (
  targetKeys: string
): [boolean, (val: boolean) => void] => {
  const [keyCombinationPressed, setKeyCombinationPressed] = useState(false);
  const [modPressed, setModPressed] = useState(false);

  const [mod, key] = targetKeys.split("+").map((key) => key.trim());

  const [keyPressed] = useKeyPress(key);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === mod) {
      setModPressed(true);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === mod) {
      setModPressed(false);
    }
  }

  useEffect(() => {
    if (modPressed) {
      if (keyPressed) {
        setKeyCombinationPressed(true);
      }
    }
  }, [modPressed, keyPressed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [modPressed]);

  return [keyCombinationPressed, setKeyCombinationPressed];
};
