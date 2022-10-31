import { useCallback, useEffect } from "react";

export function useKeyListener(onKeyPress: () => void, keyCode: number, listen = true) {
    const keyPressCallback = useCallback((event: KeyboardEvent) => {
        if (event.keyCode === keyCode) {
            onKeyPress();
        }
    }, [keyCode, onKeyPress]);

    useEffect(() => {
        if (listen) {
            document.addEventListener("keydown", keyPressCallback, false);

            return () => {
                document.removeEventListener("keydown", keyPressCallback, false);
            };
        }

        return;
    }, [keyPressCallback, listen]);

    return null;
}