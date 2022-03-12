import { useEffect, useMemo } from 'react';
import { CODES, KEYS } from '../constants';
import { isSupportedKey } from '../utils';

interface InputHandlerProps {
    socket: WebSocket,
    player: 'ONE' | 'TWO',
}

const InputHandler = (props: InputHandlerProps) => {
    const { socket, player } = props;

    const directionalKeys = useMemo(() => {
        const directionalKeysMap = {
            ONE: [KEYS.P1_UP, KEYS.P1_DOWN],
            TWO: [KEYS.P2_UP, KEYS.P2_DOWN],
        };

        return directionalKeysMap[player]
    }, [player]);

    useEffect(() => {
        const keyDownListener = (e: KeyboardEvent) => {
            const inputKey = e.key;

            if (!isSupportedKey(inputKey)) {
                return;
            }

            if (inputKey === ' ') {
                socket.send(CODES[inputKey])
            } else if (directionalKeys.includes(inputKey)) {
                socket.send(`${CODES[inputKey]}_SET`)
            }
        };

        const keyUpListener = (e: KeyboardEvent) => {
            const inputKey = e.key;

            if (!isSupportedKey(inputKey)) {
                return;
            }

            if (inputKey !== ' ' && directionalKeys.includes(inputKey)) {
                socket.send(`${CODES[inputKey]}_UNSET`)
            }
        };

        document.addEventListener("keydown", keyDownListener);
        document.addEventListener("keyup", keyUpListener);

        return () => {
            document.removeEventListener("keydown", keyDownListener);
            document.addEventListener("keyup", keyUpListener);
        }
    }, [directionalKeys, socket]);

    return null;
};

export default InputHandler;