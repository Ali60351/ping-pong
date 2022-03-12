import { useEffect } from 'react';
import { CODES } from '../constants';
import { isSupportedKey } from '../utils';

interface InputHandlerProps {
    socket: WebSocket
}

const InputHandler = (props: InputHandlerProps) => {
    const { socket } = props;

    useEffect(() => {
        const keyDownListener = (e: KeyboardEvent) => {
            const inputKey = e.key;

            if (!isSupportedKey(inputKey)) {
                return;
            }

            if (inputKey === ' ') {
                socket.send(CODES[inputKey])
            } else {
                socket.send(`${CODES[inputKey]}_SET`)
            }
        };

        const keyUpListener = (e: KeyboardEvent) => {
            const inputKey = e.key;

            if (!isSupportedKey(inputKey)) {
                return;
            }

            if (inputKey !== ' ') {
                socket.send(`${CODES[inputKey]}_UNSET`)
            }
        };

        document.addEventListener("keydown", keyDownListener);
        document.addEventListener("keyup", keyUpListener);

        return () => {
            document.removeEventListener("keydown", keyDownListener);
        }
    }, [socket]);

    return null;
};

export default InputHandler;