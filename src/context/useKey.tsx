import { useEffect } from "react";

export const useKeyPress = (
  targetKey: string,
  onKeyPress: ({ up, down }: { up: boolean; down: boolean }) => void
) => {
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      onKeyPress({ up: false, down: true });
    }
  };

  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      onKeyPress({ up: true, down: false });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
};

export const useComboKeyPress = (
  targetKeys: string,
  onKeyPress: () => void
) => {
  const [mod, key] = targetKeys.split("+").map((key) => key.trim());
  let modPressed = false;

  useKeyPress(key, ({ down }) => {
    console.log({ modPressed });
    if (modPressed && down) {
      console.log(`${key} pressed`);
      onKeyPress();
    }
  });

  const downHandler = (event: KeyboardEvent) => {
    if (event.key === mod) {
      modPressed = true;
    }
  };

  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === mod) {
      modPressed = false;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
};
