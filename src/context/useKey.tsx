import { useEffect, useState } from "react";

export const useKeyPress = (targetKey: string) => {
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

  return keyPressed;
};

export const useComboKeyPress = (targetKeys: {
  mod: string;
  key: string;
}): [boolean, (val: boolean) => void] => {
  const [keyCombinationPressed, setKeyCombinationPressed] = useState(false);
  const [modPressed, setModPressed] = useState(false);

  const keyPressed = useKeyPress(targetKeys.key);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === targetKeys.mod) {
      setModPressed(true);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.key === targetKeys.mod) {
      setModPressed(false);
    }
  }

  useEffect(() => {
    if (modPressed) {
      if (keyPressed) {
        setKeyCombinationPressed(true);
      }
    } else {
      // if (!keyPressed) setKeyCombinationPressed(false);
    }
  }, [modPressed, keyPressed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      // setKeyCombinationPressed(false);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [modPressed]);

  return [keyCombinationPressed, setKeyCombinationPressed];
};
